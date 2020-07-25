import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip'

// {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { MatTableFilterModule } from 'mat-table-filter';
import { jqxChartModule } from 'jqwidgets-ng/jqxchart';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main/main.component';
import { AirlinesComponent } from './components/main/airlines/airlines.component';
import { AirlinesListComponent } from './components/main/airlines/airlines-list/airlines-list.component';
import { AirlineDetailsComponent } from './components/main/airlines/airline-details/airline-details.component';
import { AirlineComponent } from './components/main/airlines/airlines-list/airline/airline.component';
import { FlightComponent } from './components/main/airlines/airline-details/flight/flight.component';
import { FlightReservationComponent } from './components/main/airlines/flight-reservation/flight-reservation.component';
import { DateFilterPipe } from './pipes/date-filter.pipe';
import { PriceFilterPipe } from './pipes/price-filter.pipe';
import { HeaderComponent } from './components/main/header/header.component';
import { RentACarComponent } from './components/main/rent-a-car/rent-a-car.component';
import { RentACarListComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-list.component';
import { RentACarDetailsComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/rent-a-car-details.component';
import { RentACarItemComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-item/rent-a-car-item.component';
import { RentACarStartComponent } from './components/main/rent-a-car/rent-a-car-start/rent-a-car-start.component';
import { VehicleListComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/vehicle-list/vehicle-list.component';
import { VehicleItemComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/vehicle-list/vehicle-item/vehicle-item.component';
import { VehicleDetailsComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/vehicle-list/vehicle-item/vehicle-details/vehicle-details.component';
import { VehicleStartComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/vehicle-list/vehicle-start/vehicle-start.component';
import { FilterPipe } from './pipes/filter.pipe';
import { VehicleReserveComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/vehicle-list/vehicle-item/vehicle-details/vehicle-reserve/vehicle-reserve.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ReturnFlightComponent } from './components/main/airlines/airline-details/return-flight/return-flight.component';
import { SeatSelectorComponent } from './components/main/airlines/flight-reservation/seat-selector/seat-selector.component';
import { RentACarProfileComponent } from './components/main/rent-a-car/rent-a-car-profile/rent-a-car-profile.component';
import { AirlineEditComponent } from './components/main/airlines/airline-edit/airline-edit.component';
import { AirlineService } from './services/airline.service';
import { VehicleManagerComponent } from './components/main/rent-a-car/rent-a-car-profile/vehicle-manager/vehicle-manager.component';
import { FlightEditComponent } from './components/main/airlines/flight-edit/flight-edit.component';
import { RentACarManagerComponent } from './components/main/rent-a-car/rent-a-car-manager/rent-a-car-manager.component';
import { UserAuthentificationComponent } from './components/user-authentification/user-authentification.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AirlineFastTicketsComponent } from './components/main/airlines/airline-details/airline-fast-tickets/airline-fast-tickets.component';
import { SeatsEditComponent } from './components/main/airlines/flight-edit/seats-edit/seats-edit.component';
import { SeatDetailsComponent } from './components/main/airlines/flight-edit/seat-details/seat-details.component';
import { SeatStarterComponent } from './components/main/airlines/flight-edit/seat-starter/seat-starter.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { VehicleTabListComponent } from './components/main/rent-a-car/rent-a-car-list/rent-a-car-details/vehicle-list/vehicle-tab-list/vehicle-tab-list.component';
import { ReservationsComponent } from './components/main/reservations/reservations.component';
import { ReservationListComponent } from './components/main/reservations/reservation-list/reservation-list.component';
import { AdminFlightsComponent } from './components/main/airlines/airline-details/admin-flights/admin-flights.component';
import { ReservationItemComponent } from './components/main/reservations/reservation-list/reservation-item/reservation-item.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './auth/auth.interceptor';
import { TokenInterceptor } from './auth/tokenInterceptor';
import { DiscountsComponent } from './components/main/discounts/discounts.component';
import { FriendsComponent } from './components/main/friends/friends.component';
import { FriendsListComponent } from './components/main/friends/friends-list/friends-list.component';
import { FriendComponent } from './components/main/friends/friends-list/friend/friend.component';
import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, AuthService, SocialLoginModule } from 'angularx-social-login';
import { UserSearchPipe } from './pipes/user-search.pipe';
import { EmailConfirmationComponent } from './components/main/email-confirmation/email-confirmation.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { GraphComponent } from './components/main/graph/graph.component';
import { FlightReservationDetailsComponent } from './components/main/reservations/flight-reservation-details/flight-reservation-details.component';
import { RatingComponent } from './components/rating/rating.component';
import { VehicleReservationDetailsComponent } from './components/main/reservations/vehicle-reservation-details/vehicle-reservation-details.component';
import { VehicleSaleListComponent } from './components/main/rent-a-car/vehicle-sale-list/vehicle-sale-list.component';
import { VehicleSaleItemComponent } from './components/main/rent-a-car/vehicle-sale-list/vehicle-sale-item/vehicle-sale-item.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { LoadingComponent } from './components/loading/loading.component';

export function socialConfigs() {  
  const config = new AuthServiceConfig(  
    [  
      {  
        id: FacebookLoginProvider.PROVIDER_ID,  
        provider: new FacebookLoginProvider('868105937025589')  
      },  
      {  
        id: GoogleLoginProvider.PROVIDER_ID,  
        provider: new GoogleLoginProvider('29677269628-nklev10der165c58p1duoqn7r89kkgt6.apps.googleusercontent.com')  
      }  
    ]  
  );  
  return config;  
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AirlinesComponent,
    AirlinesListComponent,
    AirlineDetailsComponent,
    AirlineComponent,
    FlightComponent,
    FlightReservationComponent,
    DateFilterPipe,
    PriceFilterPipe,
    HeaderComponent,
    RentACarComponent,
    RentACarListComponent,
    RentACarDetailsComponent,
    RentACarItemComponent,
    RentACarStartComponent,
    VehicleListComponent,
    VehicleItemComponent,
    VehicleDetailsComponent,
    VehicleStartComponent,
    FilterPipe,
    VehicleReserveComponent,
    OrderByPipe,
    ReturnFlightComponent,
    SeatSelectorComponent,
    RentACarProfileComponent,
    AirlineEditComponent,
    VehicleManagerComponent,
    FlightEditComponent,
    RentACarManagerComponent,
    UserAuthentificationComponent,
    LogInComponent,
    AirlineFastTicketsComponent,
    SeatsEditComponent,
    SeatDetailsComponent,
    SeatStarterComponent,
    DropdownDirective,
    VehicleTabListComponent,
    ReservationsComponent,
    ReservationListComponent,
    AdminFlightsComponent,
    ReservationItemComponent,
    DiscountsComponent,
    FriendsListComponent,
    FriendComponent,
    FriendsComponent,
    UserSearchPipe,
    EmailConfirmationComponent,
    ChangePasswordComponent,
    GraphComponent,
    FlightReservationDetailsComponent,
    RatingComponent,
    VehicleReservationDetailsComponent,
    VehicleSaleListComponent,
    VehicleSaleItemComponent,
    UnauthorizedComponent,
    LoadingComponent,
  ],
  entryComponents: [
    LogInComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    MatTableFilterModule,
    TooltipModule.forRoot(),
    HttpClientModule,
    SocialLoginModule,
    jqxChartModule
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AuthService,
    {  
      provide: AuthServiceConfig,  
      useFactory: socialConfigs  
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
