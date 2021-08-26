import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import locale from '@angular/common/locales/es';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData, CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './app.material.module';
import { AppRouting } from './app.routing';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SubheaderComponent } from './shared/components/subheader/subheader.component';
import { UtilsService } from './shared/services/common/utils.service';
import { ENV } from 'src/environments/environment';
import { CONFIG } from 'src/environments/configurations';
import { getPaginatorIntl } from './shared/services/common/paginator.lang';
import { MainMessageComponent } from './shared/components/modals/main-message/main-message.component';
import { AutenticacionService } from './shared/services/autenticacion/autenticacion.service';
import { SharedModule } from './shared/share.module';
import { InterceptorService } from './app.interceptor';
import { PerfilService } from './shared/services/common/perfil.service';
import { UsuariosService } from './shared/services/usuarios.service';

registerLocaleData(locale, ENV.locale);

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    FooterComponent,
    HeaderComponent,
    SubheaderComponent,
    MainMessageComponent
  ],
  imports: [
    AngularMaterialModule,
    FlexLayoutModule,
    AppRouting,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HammerModule,
    CommonModule, 
    HttpClientModule,
    SharedModule
  ],
  providers: [
    UtilsService,
    AutenticacionService,
    PerfilService,
    UsuariosService,
    { provide: MAT_DATE_LOCALE, useValue: ENV.locale },
    { provide: LOCALE_ID, useValue: ENV.locale },
    { provide: MAT_DATE_FORMATS, useValue: CONFIG.DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getPaginatorIntl() },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  entryComponents: [MainMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
