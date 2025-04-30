import { Component, OnInit } from '@angular/core'; // Import OnInit
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenuModule, RouterModule], // Add PanelMenuModule and RouterModule
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss' // Correct styleUrl to .scss
})
export class AsideComponent implements OnInit { // Implement OnInit
  items: MenuItem[]=[];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-users',
        routerLink: '/clientes'
        // items: [
        //   {
        //     label: 'Crud Cliente'
        //   },
        //   {
        //     label: 'HTML 2'
        //   }
        // ]
      },
      {
        label: 'Tipo Productos',
        icon: 'pi pi-fw pi-qrcode',
        // Add routerLink if needed
      },
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-shopping-bag',
        // Add routerLink if needed
      },
      {
        label: 'Ventas',
        icon: 'pi pi-fw pi-shopping-cart',
        // Add routerLink if needed
      }
    ];
  }
}
