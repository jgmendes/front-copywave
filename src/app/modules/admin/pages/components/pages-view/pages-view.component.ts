import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PageInterface } from '../../pages.types';
import { PagesService } from '../../pages.service';

@Component({
  selector: 'app-pages-view',
  templateUrl: './pages-view.component.html',
})
export class ViewPageComponent implements OnInit, OnDestroy {
  public id: number;
  public page: PageInterface;
  public pageContent: SafeHtml;

  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private readonly service: PagesService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));
      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: PageInterface): void => {
            this.page = res;
            this.http
              .get(`@hubsd-api/proxy/${this.page.id}`, { responseType: 'text' })
              .subscribe((response) => {
                this.pageContent =
                  this.sanitizer.bypassSecurityTrustHtml(response);
              });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  toggleFullScreen(): void {
    const elem = document.querySelector('iframe');
    if (elem) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
      } else {
        document.exitFullscreen();
      }
    }
  }
}
