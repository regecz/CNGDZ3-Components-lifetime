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

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.fetchComponents();
  }

  fetchComponents() {
    const offset = this.currentPage * this.pageSize;
    const limit = this.pageSize;

    this.http.get<{components: any[]; totalComponents: number}>(`http://localhost:3000/components/getComponents?limit=${limit}&offset=${offset}`, { withCredentials: true }).subscribe(
      (data) => {
        this.components = data.components;
        this.totalComponents = data.totalComponents; 
        console.log(this.components);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching components', error);
        this.router.navigate(['/login']); // Navigáció hiba esetén
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
  onEdit(id: string) {
    console.log('Edit component with ID:', id);
  }
}