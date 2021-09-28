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
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins/align.min.js'
import 'froala-editor/js/plugins/char_counter.min.js'
import 'froala-editor/js/plugins/fullscreen.min.js'
import 'froala-editor/js/plugins/link.min.js'
import 'froala-editor/js/plugins/lists.min.js'
import { FormEventosComponent } from './components/modals/form-eventos/form-eventos.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormCategoriasDescargablesComponent } from './components/modals/form-categoriasdescargables/form-categoriasdescargables.component';
import { FormDescargablesComponent } from './components/modals/form-descargables/form-descargables.component';

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
        FroalaEditorModule.forRoot(), 
        FroalaViewModule.forRoot(),
        NgxMaterialTimepickerModule,
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
        FormDescargablesComponent
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
        FroalaEditorModule, 
        FroalaViewModule,
    ]
})
export class SharedModule { }