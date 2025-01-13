import { Subject, finalize, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { PageInterface } from '../../pages.types';
import { PagesService } from '../../pages.service';
import { urlValidator } from './validators/url-validator';
import { HubsdToastService } from '@hubsd/services/toast';
import { UserService } from '../../../../../core/user/user.service';
import { CompanyInterface } from '../../../companies/companies.types';
import { CityInterface } from '../../../../../core/common/common.types';
import { CommonService } from '../../../../../core/common/common.service';

@Component({
  selector: 'app-pages-simple',
  templateUrl: './pages-simple.component.html',
  styleUrl: './pages-simple.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PagesSimpleComponent implements OnInit, OnDestroy {
  public cities: CityInterface[];
  public companies: CompanyInterface[];
  public userCompanyId: number;
  public id: number;
  public page: PageInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();
  color1: string = '#000000';
  color2: string = '#000000';
  color3: string = '#000000';
  color4: string = '#000000';

  constructor(
    private readonly router: Router,
    private readonly service: PagesService,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly toastService: HubsdToastService,
    private readonly common: CommonService
  ) {}

  ngOnInit(): void {
    this.userService
      .verifyPlans()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        if (!data.plan) {
          setTimeout(() => {
            this.toastService.handleMessage(
              {
                error: {
                  message: 'Você precisa de um plano para acessar essa página.',
                },
              },
              null,
              { handleRequest: true }
            );
            this.router.navigateByUrl('planos');
          }, 1000);
        }
      });

    this.common.cities$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res) => {
        this.cities = res;
      });
    this.form = this.formBuilder.group({
      domain: ['', [Validators.required, urlValidator()]],
      cookies: [false, []],
      facebookPixel: [{ value: '', disabled: true }],
      tiktokPixel: [{ value: '', disabled: true }],
      kwaiPixel: [{ value: '', disabled: true }],
      url: ['', [Validators.required, urlValidator()]],
      checkoutUrl: ['', [Validators.required, urlValidator()]],
      hiddenFields: ['', []],
      texts: this.formBuilder.array([]),
      colors: this.formBuilder.array([]),
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: PageInterface): void => {
            this.page = res;
            this.form.patchValue({ ...res });
          });
      }
    });
    this.addNewFieldForm('texts');
    this.addNewFieldForm('colors');
  }

  changeCheckBox(event: string): void {
    const formControl = this.form.get(event);
    if (event === 'cookies') {
      formControl.setValue(!formControl.value);
    } else {
      if (formControl.enabled) {
        formControl.disable();
        formControl.setValue('');
        formControl.removeValidators([Validators.required, urlValidator()]);
      } else {
        formControl.enable();
        formControl.setValue('');
        formControl.addValidators([Validators.required, urlValidator()]);
        formControl.markAsDirty();
      }
    }
  }

  addNewFieldForm(type: string): void {
    const fieldArray = this.form.get(type) as UntypedFormArray;
    fieldArray.push(
      this.formBuilder.group({
        current: [type === 'colors' ? '#000000' : ''],
        replace: [type === 'colors' ? '#000000' : ''],
      })
    );
  }

  getFieldsFormArray(type: string): UntypedFormArray {
    return this.form.get(type) as UntypedFormArray;
  }

  updateColor(event: Event, colorField: any): void {
    const inputValue = (event.target as HTMLInputElement).value;

    if (/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      colorField.value = inputValue;
    } else if (inputValue === '') {
      colorField.value = '#000000';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSaveOrUpdate(): void {
    this.form.disable();
    const formValue = this.form.value;
    if (this.id) {
      this.service
        .update({ id: this.id, ...formValue })
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, {
              handleRequest: true,
            });
            this.router.navigateByUrl('paginas');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar a página.',
              { handleRequest: true }
            );
          },
        });
    } else {
      this.service
        .create(formValue)
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, {
              handleRequest: true,
            });
            this.router.navigateByUrl('paginas');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar a página.',
              { handleRequest: true }
            );
          },
        });
    }
    this.disablePixels();
  }

  disablePixels(): void {
    if (!this.form.get('facebookPixel').value) {
      this.form.get('facebookPixel').disable();
    }
    if (!this.form.get('tiktokPixel').value) {
      this.form.get('tiktokPixel').disable();
    }
    if (!this.form.get('kwaiPixel').value) {
      this.form.get('kwaiPixel').disable();
    }
  }
}
