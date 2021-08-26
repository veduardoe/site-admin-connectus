import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MenuInternoComponent } from './components/menu-interno/menu-interno.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { EmptyPipe } from './pipes/empty.pipe';
import { RemoveUnderscorePipe } from './pipes/remove-underscore.pipe';
import { ReturnComponent } from './components/return/return.component';
import { RouterModule } from '@angular/router';
import { FormAdministradoresComponent } from './components/modals/form-administradores/form-administradores.component';
import { FormBannersComponent } from './components/modals/form-banners/form-banners.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FlexLayoutModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxCurrencyModule,
        RouterModule
    ],
    declarations: [
        MenuInternoComponent,
        EmptyPipe,
        FormAdministradoresComponent,
        FormBannersComponent,
        RemoveUnderscorePipe,
        ReturnComponent,
    ],
    providers: [],
    exports: [
        MenuInternoComponent,
        ReturnComponent,
        CommonModule,
        HttpClientModule,
        FlexLayoutModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxCurrencyModule,
        EmptyPipe,
        RemoveUnderscorePipe
    ]
})
export class SharedModule { }