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
import { FormEventosComponent } from './components/modals/form-eventos/form-eventos.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormCategoriasDescargablesComponent } from './components/modals/form-categoriasdescargables/form-categoriasdescargables.component';
import { FormDescargablesComponent } from './components/modals/form-descargables/form-descargables.component';
import { FormCategoriasComponent } from './components/modals/form-categorias/form-categorias.component';
import { FormArticulosPublicosComponent } from './components/modals/form-articulospublicos/form-articulospublicos.component';
import { ExcerptPipe } from './components/pipes/excerpt.pipe';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ViewPostComponent } from './components/modals/view-post/view-post.component';
import { LightgalleryModule } from 'lightgallery/angular';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FlexLayoutModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxCurrencyModule,
        RouterModule,
        NgxMaterialTimepickerModule,
        AngularEditorModule,
        LightgalleryModule
    ],
    declarations: [
        MenuInternoComponent,
        EmptyPipe,
        FormAdministradoresComponent,
        FormBannersComponent,
        FormEventosComponent,
        RemoveUnderscorePipe,
        ReturnComponent,
        FormCategoriasDescargablesComponent,
        FormDescargablesComponent,
        FormCategoriasComponent,
        FormArticulosPublicosComponent,
        ViewPostComponent,
        ExcerptPipe
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
        NgxMaterialTimepickerModule,
        EmptyPipe,
        RemoveUnderscorePipe,
        ExcerptPipe,
        AngularEditorModule    ]
})
export class SharedModule { }