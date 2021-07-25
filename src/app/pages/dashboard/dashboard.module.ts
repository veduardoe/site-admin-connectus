import { NgModule } from "@angular/core";
import { DashboardAdminComponent } from "./dashboard-admin/dashboard-admin.component";
import { DashboardAgentesComponent } from "./dashboard-agentes/dashboard-agentes.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";

@NgModule({
    imports: [DashboardRoutingModule],
    declarations:[
        DashboardAdminComponent,
        DashboardAgentesComponent
    ]
})
export class DashboardModule { }
