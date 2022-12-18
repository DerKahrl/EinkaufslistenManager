import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProduktInfo } from 'src/app/api.interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewProductComponent } from './create-new-product/create-new-product.component';
import { ApiService } from 'src/app/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageTitleService } from 'src/app/page-title.service';

@Component({
  selector: 'app-produkte-verwaltung',
  templateUrl: './produkte-verwaltung.component.html',
  styleUrls: ['./produkte-verwaltung.component.scss']
})
export class ProdukteVerwaltungComponent implements AfterViewInit {

  /** Data source for the table */
  dataSource = new MatTableDataSource<ProduktInfo>();

  /** Paginator for the table */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Columns to be displayed in the table */
  displayedColumns = ['bezeichnung', 'istZutat', 'eigenschaften', 'buttons'];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private pageTitleService: PageTitleService,
  ) {
    /** Update the products on component initialization */
    this.updateProducts();

    /** Set the page title */
    this.pageTitleService.setTitle('Produkte');
  }

  /** Initialize the paginator after the view has been initialized */
  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  /** Delete a product from the table and the API */
  public deleteEntry(produkt: ProduktInfo): void {
    /** Remove the product from the data source */
    this.dataSource.data = this.dataSource.data.filter( e => e !== produkt );

    /** Call the delete API endpoint */
    this.apiService.productDelete$(produkt)
      .subscribe(
        /** Update the products */
        () => this.updateProducts(),
        () => this.updateProducts()
      );
  }

  /** Open the new product dialog */
  public newProduct() {
    this.dialog.open(CreateNewProductComponent).afterClosed().subscribe((result: ProduktInfo) => {
      if (result) {
        /** Call the create API endpoint on success */
        this.apiService.productCreate$(result)
          .subscribe(
            () => this.updateProducts(),
            (error: HttpErrorResponse) => console.log(error)
          );
      }
    });
  }
  /** Open the edit product dialog */
  public editProduct(product: ProduktInfo) {
    this.dialog.open(CreateNewProductComponent, { data: product }).afterClosed().subscribe((result: ProduktInfo) => {
      if (result) {
        this.apiService.productUpdate$(result)
          .subscribe(
            () => this.updateProducts(),
            (error: HttpErrorResponse) => console.log(error)
          );
      }
    });
  }

  /** Retrieving a list of all products from the server and updating the data source for the table in the component template */
  public updateProducts() {
    this.apiService.getAllProducts$()
      .subscribe(
        (result: ProduktInfo[]) => this.dataSource.data = result,
        (error: HttpErrorResponse) => console.log(error)
      );
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
