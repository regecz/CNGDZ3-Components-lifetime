import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AllComponentsComponent } from './all-components/all-components.component';

export const routes: Routes = [
    { path: '', 
    component: LayoutComponent, 
    children: [
        {path: '', component: LoginComponent},
        {path: 'components', component: AllComponentsComponent},
    ]},
    
];
