import {Component, Input, OnInit} from '@angular/core';
import {PageNavigationService} from '../../../services/page-navigation.service';
import {PiisConsent, User} from '../../../models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {map, takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountAccess} from '../../../models/account-access.model';
import {PiisConsentService} from '../../../services/piis-consent.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CurrencyService} from '../../../services/currency.service';
import {SpinnerVisibilityService} from 'ng-http-loader';
import {Subject} from 'rxjs';
import {InfoService} from '../../../commons/info/info.service';
import {moment} from "ngx-bootstrap/chronos/test/chain";

@Component({
  selector: 'app-user-create-funds-confirmation',
  templateUrl: './user-create-funds-confirmation.component.html',
  styleUrls: ['./user-create-funds-confirmation.component.scss']
})
export class UserCreateFundsConfirmationComponent implements OnInit {
  user: User;
  userId: string;
  iban: any;
  createFundsFormGroup: FormGroup;
  currencyList: any;

  private unsubscribe$ = new Subject<void>();
  todayString: string;
  errorDate: string;
  errorMessage: string;

  constructor(
    public pageNavigationService: PageNavigationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private piisService: PiisConsentService,
    private currencyService: CurrencyService,
    private formBuilder: FormBuilder,
    private infoService: InfoService,
    private spinner: SpinnerVisibilityService
  ) {
  }

  ngOnInit() {
    this.errorDate = 'hidden';
    this.createFundsFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
      iban: ['', Validators.required],
      tppAuthorisationNumber: ['', Validators.required],
      currency: ['EUR', Validators.required],
      validUntil: ['', Validators.required],
    });

    this.activatedRoute.params
      .pipe(
        map((response) => {
          return response.id;
        })
      )
      .subscribe((id: string) => {
        this.userId = id;
        this.getUserDetails();
        this.initializeCurrenciesList();
      });
  }

  getUserDetails() {
    this.userService.getUser(this.userId).subscribe((item: User) => {
      this.user = item;
      console.log(this.user);
      if (this.user.accountAccesses.length >= 1) {
        this.createFundsFormGroup.get('iban').setValue(this.user.accountAccesses[0].iban);
      }
    });
  }

  initializeCurrenciesList() {
    this.spinner.show();

    return this.currencyService
      .getSupportedCurrencies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.currencyList = data;
          this.spinner.hide();
        },
        () => this.infoService.openFeedback(
          'Currencies list cannot be initialized',
          {severity: 'error'}
        )
      );
  }

  handleClickOnBackButton() {
    this.pageNavigationService.setLastVisitedPage(
      `user/${this.user.id}/update-user-details/`
    );
    this.router.navigate([`users/${this.user.id}`]);
  }

  onSubmit() {
    /*Execute Jsoninput */
    const password = this.createFundsFormGroup.get('password').value;
    const piisConsent = new PiisConsent();
    piisConsent.validUntil = this.createFundsFormGroup.get('validUntil').value;
    piisConsent.tppAuthorisationNumber = this.createFundsFormGroup.get('tppAuthorisationNumber').value;
    piisConsent.access = new AccountAccess();
    piisConsent.access.iban = this.createFundsFormGroup.get('iban').value;
    piisConsent.access.currency = this.createFundsFormGroup.get('currency').value;
    console.log(piisConsent);
    console.log(piisConsent.validUntil)
    console.log( this.todayString)

    if (new Date(piisConsent.validUntil) >= new Date()){
      this.errorDate ='hidden'
      this.piisService.createPiisConsent(piisConsent, this.user.login, password).subscribe(res => {
        this.handleClickOnBackButton();
        console.log(res);
      }, (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = error.error
              ? error.error.message
              : error.message;
          }
        });
    } else {
      this.errorDate ='visible'
    }

  }
}
