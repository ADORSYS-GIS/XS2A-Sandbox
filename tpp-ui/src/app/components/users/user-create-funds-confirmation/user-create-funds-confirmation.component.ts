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
  currencyList?: any;
  ibanList?: String[];
  private unsubscribe$ = new Subject<void>();
  todayString: string;
  errorMessage: string;
  private errorText = "Invalid password for user"

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
        this.ibanList = this.user.accountAccesses.map(access => access.iban);
        this.createFundsFormGroup.get('iban').setValue(this.ibanList[0]);
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

    if (new Date(piisConsent.validUntil) >= new Date()) {
      this.piisService.createPiisConsent(piisConsent, this.user.login, password).subscribe(res => {
        this.handleClickOnBackButton();
      }, (error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message.match(this.errorText)) {
          this.errorMessage = error.error
            ? error.error.message
            : error.message;
        }
      });
    } else {
      this.errorMessage = " Please choose a valid date in the future!"
    }
  }


}
