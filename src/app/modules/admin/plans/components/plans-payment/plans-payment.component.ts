import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import {
  Inject,
  OnInit,
  OnDestroy,
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  Input,
} from '@angular/core';

import { HubsdToastService } from '@hubsd/services/toast';
import { HubsdConfigService } from '@hubsd/services/config';
import { PaymentConfigInterface } from './plans-payment.types';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../core/auth/auth.service';
import { PlansPricesEnum } from './plans-payment.enum';

declare global {
  interface Window {
    MercadoPago: any;
    paymentBrickController: any;
  }
}

@Component({
  selector: 'app-plans-payment',
  templateUrl: './plans-payment.component.html',
  styles: [
    `
      #form-checkout {
        display: flex;
        flex-direction: column;
        max-width: 600px;
      }

      .container {
        height: 18px;
        display: inline-block;
        border: 1px solid rgb(118, 118, 118);
        border-radius: 2px;
        padding: 1px 2px;
      }

      .mat-mdc-dialog-container {
        .mdc-dialog__surface {
          padding: 0px;
        }
      }

      .qr-code {
        width: 100%;
        max-width: 250px; /* Limite máximo do tamanho do QR code */
        height: auto; /* Mantém a proporção correta da imagem */
        object-fit: contain;
      }

      /* Ajuste para telas menores */
      @media (max-width: 640px) {
        .qr-code {
          max-width: 180px; /* Reduz o QR code em telas pequenas */
        }
      }

      .break-words {
        word-wrap: break-word; /* Quebra o texto do código PIX em linhas */
      }

      .cursor-pointer {
        cursor: pointer; /* Altera o cursor para indicar que é clicável */
      }

      .font-mono {
        font-family: monospace; /* Estilo monoespaçado para o código PIX */
      }

      .mt-4 {
        margin-top: 1rem;
      }

      .mt-2 {
        margin-top: 0.5rem;
      }

      .bg-gray-100 {
        background-color: #f7fafc; /* Cor de fundo suave */
      }

      .p-2 {
        padding: 0.5rem;
      }

      .rounded {
        border-radius: 0.375rem;
      }

      .text-gray-500 {
        color: #6b7280; /* Cor de texto cinza suave */
      }

    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PlansPaymentComponent implements OnInit, OnDestroy {
  public mp: any;
  public mode: string;
  public qrCodeUrl: string | null = null;
  public pixCode: string | null = null;
  @Input() data: PaymentConfigInterface;

  private currentPlan: string;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      this.data = {
        plan: params['plan'],
        month: params['month'] === 'true', // Converta para booleano se necessário
      } as PaymentConfigInterface;

      this.currentPlan = `${this.data.plan}_${
        this.data.month ? 'month' : 'year'
      }`;
      this.sendPayment();
    });
  }
  constructor(
    private route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly toastService: HubsdToastService,
    private readonly configService: HubsdConfigService
  ) {}

  async sendPayment() {
    this.configService.config$
      .pipe(take(1), takeUntil(this.unsubscribeAll))
      .subscribe((config): void => {
        if (config.scheme === 'auto') {
          this.mode =
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? (this.mode = 'dark')
              : (this.mode = 'light');
        } else {
          this.mode = config.scheme;
        }
      });
    await loadMercadoPago();
    const mp = new window.MercadoPago(environment.mercadoPagoPublicKey, {
      locale: 'pt-BR',
    });
    this.mp = mp;
    const bricksBuilder = mp.bricks();
    const renderPaymentBrick = async (bricksBuilder) => {
      const settings = {
        initialization: {
          amount: parseFloat(
            PlansPricesEnum[this.currentPlan].replace(',', '.')
          ),
        },
        customization: {
          visual: {
            style: {
              theme: this.mode,
            },
          },
          paymentMethods: {
            creditCard: 'all',
            bankTransfer: 'all',
            maxInstallments: 1,
          },
        },
        callbacks: {
          onReady: () => {},
          onSubmit: ({ selectedPaymentMethod, formData }) => {
            formData.plan = this.currentPlan;
            return new Promise((resolve, reject) => {
              fetch(`${environment.urlApi}/payments/create_preference`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.authService.accessToken}`,
                },
                body: JSON.stringify(formData),
              })
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  this.cdr.detectChanges();
                  if (data.error) {
                    this.router.navigate(['planos/pagamento/erro'], {
                      queryParams: { error: data.error.message },
                    });
                    reject(data.error);
                  }
                  if (data.payment_method_id === 'pix') {
                    this.qrCodeUrl =
                      data.point_of_interaction.transaction_data.qr_code_base64;
                    this.pixCode = data.point_of_interaction.transaction_data.qr_code;  
                      this.cdr.detectChanges(); // Forçar a atualização da interface
                    this.pixVerify(data);
                  } else {
                    this.finishPayment(data.id);
                  }
                  resolve(data);
                })
                .catch((error) => {
                  this.destroyPaymentBrick();
                  this.router.navigate(['planos/pagamento/erro'], {
                    queryParams: { error: error.message },
                  });
                  reject(error);
                });
            });
          },
          onError: (error) => {
            this.destroyPaymentBrick();
            this.router.navigate(['planos/pagamento/erro'], {
              queryParams: { error: error.message },
            });
          },
        },
      };

      window.paymentBrickController = await bricksBuilder.create(
        'payment',
        'paymentBrick_container',
        settings
      );
    };
    renderPaymentBrick(bricksBuilder);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
    this.destroyPaymentBrick();
  }

  private destroyPaymentBrick(): void {
    if (window.paymentBrickController) {
      window.paymentBrickController.unmount();
      window.paymentBrickController = null;
    }
  }

  async pixVerify(data: any) {
    let newData = data;
    fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer APP_USR-60532824750992-082215-81cb6a02699c2ff9ae9a2dfce17f7cd4-1453499984`,
      },
    }).then((data) => {
      newData = data;
    });
    if (newData.status === 'approved') {
      this.finishPayment(data.id);
    } else {
      setTimeout(() => {
        this.pixVerify(data);
      }, 10000);
    }
  }

  finishPayment(id?: string): void {
    this.router.navigate([`planos/pagamento/${id}`]);
  }

  copyPixCode() {
    navigator.clipboard.writeText(this.pixCode).then(
      () => {
        alert('Código PIX copiado com sucesso!');
      },
      (err) => {
        console.error('Erro ao copiar o código PIX: ', err);
      }
    );
  }
}
