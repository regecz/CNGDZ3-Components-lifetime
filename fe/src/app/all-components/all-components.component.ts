import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardSubtitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponentDialogComponent } from './create-component-dialog/create-component-dialog.component';
import { UserServiceService } from '../user-service.service';
import { UpdateComponentDialogComponent } from './update-component-dialog/update-component-dialog.component';

@Component({
  selector: 'app-all-components',
  imports: [MatCard, MatCardTitle, MatCardSubtitle, CommonModule, HttpClientModule, RouterModule, MatButtonModule, MatIconModule, MatPaginator],
  templateUrl: './all-components.component.html',
  styleUrl: './all-components.component.css'
})
export class AllComponentsComponent implements OnInit {
  components: any[] = [];
  pagedComponents: any[] = [];
  pageSize: number = 5;
  currentPage: number = 0; 
  totalComponents: number = 0; 
  searchTerm: string = ''; 

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private userService: UserServiceService) { }
  ngOnInit(): void {
    this.fetchComponents();
  }

  fetchComponents() {
    const offset = this.currentPage * this.pageSize;
    const limit = this.pageSize;

    this.http.get<{components: any[]; totalComponents: number}>(`http://localhost:3000/components/getComponents?limit=${limit}&offset=${offset}&search=${this.searchTerm}`, { withCredentials: true }).subscribe(
      (data) => {
        this.components = data.components;
        this.totalComponents = data.totalComponents;
        // Ellenőrizzük, hogy az aktuális oldalindex érvényes-e
        if (this.totalComponents > 0 && offset >= this.totalComponents) {
          this.currentPage = Math.floor((this.totalComponents - 1) / this.pageSize); // Visszaállítjuk az utolsó érvényes oldalra
          this.fetchComponents();
          return;
        } else{
          this.totalComponents = data.totalComponents; 
        }

      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching components', error);
        this.router.navigate(['/']); // Navigáció hiba esetén
      }
    );
  }
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchComponents();
  }

  onDelete(id: string) {
    if (confirm('Biztosan törölni szeretnéd ezt a komponenst?')) {
      this.http.delete(`http://localhost:3000/components/deleteComponent/${id}`, { withCredentials: true }).subscribe(
        () => {
          alert('Komponens sikeresen törölve.');
          this.fetchComponents(); // Frissítsd az adatokat
        },
        (error: HttpErrorResponse) => {
          console.error('Error deleting component', error);
          alert('Hiba történt a komponens törlésekor.');
        }
      );
    }
  }

  onCreateComponent() {
    const dialogRef = this.dialog.open(CreateComponentDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.getUser().subscribe((user) => {

          const componentData = {
            compName: result.name,
            compType: result.type,
            brand: result.brand,
            status: result.status,
            description: result.description,
            serial: result.serial,
            orderedBy: user.username,
          }
          
          this.http.post('http://localhost:3000/components/addComponent', componentData, { withCredentials: true }).subscribe({
            next: () => {
              alert('Komponens sikeresen létrehozva.');
              this.fetchComponents(); // Frissítjük az adatokat
            },
            error: (error: HttpErrorResponse) => {
              console.error('Hiba történt a komponens létrehozásakor', error);
              alert('Hiba történt a komponens létrehozásakor.');
            }
          });
        });
      }
    });
  }

  onEdit(component: any) {
    const dialogRef = this.dialog.open(UpdateComponentDialogComponent, {
      width: '400px',
      data: { ...component } // Átadjuk a komponens adatait, beleértve az id-t is
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.put(`http://localhost:3000/components/updateComponent/${component._id}`, result, { withCredentials: true }).subscribe(
          () => {
            alert('Komponens sikeresen frissítve.');
            this.fetchComponents(); // Frissítjük az adatokat
          },
          (error: HttpErrorResponse) => {
            console.error('Hiba történt a komponens frissítésekor', error);
            alert('Hiba történt a komponens frissítésekor.');
          }
        );
      }
    });
  }

  private searchTimeout: any; 
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.trim();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout); // Töröljük a korábbi időzítőt
    }

    this.searchTimeout = setTimeout(() => {
      this.searchTerm = input.value.trim();
      this.fetchComponents(); 
    }, 1000);
  }
}