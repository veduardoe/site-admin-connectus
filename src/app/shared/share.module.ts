import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MenuInternoComponent } from './components/menu-interno/menu-interno.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { EmptyPipe } from './pipes/empty.pipe';
import { FormAgentesComponent } from './components/modals/form-agentes/form-agentes.component';
import { RemoveUnderscorePipe } from './pipes/remove-underscore.pipe';
import { ReturnComponent } from './components/return/return.component';
import { RouterModule } from '@angular/router';
import { FormAdministradoresComponent } from './components/modals/form-administradores/form-administradores.component';
import { PerfilService } from './services/common/perfil.service';
import { UsuariosService } from './services/usuarios/usuarios.service';
import { PropiedadesService } from './services/propiedades/propiedades.service';
import { PlanesAgentesService } from './services/planes-agentes/planes-agentes.service';
import { FormPlanesAgentesComponent } from './components/modals/form-planes-agentes/form-planes-agentes.component';
import { ClientesService } from './services/clientes/clientes.service';
import { FormClientesComponent } from './components/modals/form-clientes/form-clientes.component';
import { ConfigAppsService } from './services/config-apps/config-apps.service';
import { FormPagosComponent } from './components/modals/form-pagos/form-pagos.component';
import { SolicitudesService } from './services/solicitudes/solicitudes.servce';
import { FuenteSolicitudPipe } from './pipes/fuentes-solicitud.pipe';
import { FormAcClientesComponent } from './components/modals/form-ac-clientes/form-ac-clientes.component';
import { FormAcAgentesComponent } from './components/modals/form-ac-agentes/form-ac-agentes.component';
import { FormAcPropiedadesComponent } from './components/modals/form-ac-propiedades/form-ac-propiedades.component';
import { FormGananciasComponent } from './components/modals/form-ganancias/form-gananacias.component';
import { FormEnviarDocumentoComponent } from './components/modals/form-enviar-documento/form-enviar-documento.component';

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
        FormAgentesComponent,
        FormAdministradoresComponent,
        FormPlanesAgentesComponent,
        FormClientesComponent,
        FormPagosComponent,
        FormAcClientesComponent,
        FormAcAgentesComponent,
        FormGananciasComponent,
        FormEnviarDocumentoComponent,
        RemoveUnderscorePipe,
        FuenteSolicitudPipe,
        FormAcPropiedadesComponent,
        ReturnComponent,
        FormAcClientesComponent
    ],
    providers: [
        PerfilService, 
        UsuariosService,
        PropiedadesService,
        PlanesAgentesService,
        ClientesService,
        ConfigAppsService,
        SolicitudesService
    ],
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
        RemoveUnderscorePipe,
        FuenteSolicitudPipe,

 //       ConfigAppsService 
    ]
})
export class SharedModule { }