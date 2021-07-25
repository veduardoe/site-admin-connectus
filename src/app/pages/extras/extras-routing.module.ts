import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AutenticacionService } from "src/app/shared/services/autenticacion/autenticacion.service";
import { AmenidadesComponent } from "./amenidades/amenidades.component";
import { ConfiguracionComponent } from "./configuracion/configuracion.component";
import { HistoricoPagosPlanesComponent } from "./historico-pagos-planes/historico-pagos-planes.component";
import { TiposPropiedadesComponent } from "./tipos-propiedades/tipos-propiedades.component";

const routes: Routes = [
  { path: 'amenidades', component: AmenidadesComponent, canActivate: [AutenticacionService], data: { expected: ['ADMIN'] } },
  { path: 'tipos-propiedades', component: TiposPropiedadesComponent, canActivate: [AutenticacionService], data: { expected: ['ADMIN'] } },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [AutenticacionService], data: { expected: ['ADMIN'] } },
  { path: 'historico-pagos', component: HistoricoPagosPlanesComponent, canActivate: [AutenticacionService], data: { expected: ['*'] } },
  { path: 'historico-pagos/:idAgente', component: HistoricoPagosPlanesComponent, canActivate: [AutenticacionService], data: { expected: ['ADMIN'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtrasRoutingModule { }
