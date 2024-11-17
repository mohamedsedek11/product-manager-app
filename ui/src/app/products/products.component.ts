import { Component, ElementRef } from '@angular/core';
import { ApicallsService } from '../services/apicalls.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StarRatingPipe } from '../star-rating.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , FormsModule , StarRatingPipe ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  
  showpopup = false;

  allproducts!: any;

  allcategories!: any;

  thumbnailUrl = "http://localhost/testApi/";

  selectedFile!: File;

  createproductform!: FormGroup;

  editform!: FormGroup;
  
  searchQuery: any;

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0]; 
  }



  constructor(private api: ApicallsService , private fb : FormBuilder , private element : ElementRef) { 
    this.createproductform = this.fb.group({
      product_name: [''],
      product_price: [''],
      product_description: [''],
      product_category_id: [''],
      product_image: [this.selectedFile],
      options: [this.selectedColors],
      product_rate: ['']
    });
    
    this.editform = this.fb.group({
      product_id: [''],
      product_name: [''],
      product_price: [''],
      product_description: [''],
    })
  }
  rateArr = [1, 2, 3, 4, 5];
  ngOnInit() {
    this.getproducts();
    this.fetchCategories();
    console.log(Math.floor(4.9))
    
  }

  ratearray! :any;

  getproducts() {
    this.api.getallproducts().subscribe((res: any) => {
      this.allproducts = res;
    });
    
  }

  fetchCategories() {
    this.api.getallcategories().subscribe((res : any) => {
      this.allcategories = res;
    });
  }

  showPopup() {
    this.showpopup = true;
  }
  
  closePopup() {
    this.showpopup = false;
  }

  
  dothis() {
    console.log(this.createproductform.get('product_rate')?.value);
  }
  test() {
    
    const formData = new FormData();
    formData.append('product_name', this.createproductform.get('product_name')?.value);
    formData.append('product_price', this.createproductform.get('product_price')?.value);
    formData.append('product_description', this.createproductform.get('product_description')?.value);
    formData.append('product_rate', this.createproductform.get('product_rate')?.value);
    if (this.selectedFile) {
      formData.append('product_image', this.selectedFile, this.selectedFile.name);
    }
    formData.append('product_category_id', this.createproductform.get('product_category_id')?.value);
    formData.append('options', JSON.stringify(this.createproductform.get('options')?.value));
    this.api.addProduct(formData).subscribe((res: any) => {
      console.log(res);
      this.getproducts();
      this.closePopup();
      this.createproductform.reset();
      this.selectedColors = [];
      window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
      
    });
  }
  

  colors: string[] = ['#0745fe', 'violet', 'brown', 'chocolate', 'coral', 'aquamarine', 'salmon' , 'green' , "burlywood" ,"darkgoldenrod"];
  selectedColors: string[] = [];

  toggleColor(color: string, event: any) {
    const ele = event.target;
    
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      ele.classList.remove('selected');
      this.selectedColors.splice(index, 1);
      this.disapled();
    } else {
      ele.classList.add('selected');
      this.selectedColors.push(color);
      this.disapled();
    }
  }

  disapled() {
    const notselect = this.element.nativeElement.querySelectorAll('.color-swatch');
    if (this.selectedColors.length == 4) {
      notselect.forEach((item : any) => {
        if (item.classList == 'color-swatch') {
          item.style.opacity = '0.5';  
        };
        
      });
    } else {
      notselect.forEach((item : any) => {
        if (item.classList == 'color-swatch') {
          item.style.opacity = '1';  
        };
      });
    }
  }

  searchProducts!: any;

  search() {
    if (this.searchQuery != '') {
      this.api.searchbyname(this.searchQuery).subscribe((res: any) => {
        this.searchProducts = res;
      }, (err: any) => {
        console.log(err);
        this.searchProducts = null;
      })
    } else {
      this.searchProducts = null;
    }
  }


  resetsearch() {
    this.searchProducts = null;
    this.searchQuery = '';
  }

  showItem!: any;
  showproduct(item: any) {
    console.log(item);
    this.showItem = item;
  }

  closeshowpopup() {
    this.showItem = null;
  }


    // delete popup
  deleteItem!: any;
  deleteProduct(item: any) {
    this.deleteItem = item;
    setTimeout(() => {
      const popup = this.element.nativeElement.querySelector('.container_delete');
      console.log(popup);
      popup.classList.add('active')
      
    }, 500);
    
  }
  delete() {
    this.api.deleteproduct(this.deleteItem).subscribe((res: any) => {
      console.log(res);
      this.getproducts();
    }, (err: any) => {
      console.log(err);
    });
    this.closepopupdelete();
  }

  closepopupdelete() {
    const popup = this.element.nativeElement.querySelector('.container_delete');
    popup.classList.remove('active')
    setTimeout(() => {
      this.deleteItem = null;
    }, 500);
  }
  // delete popup


  editpopup = false
  // edit popup
  editbtnfunc(item: any) {
    this.editpopup = true;
    this.editform.patchValue({
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      product_description: item.description
    });
    
  }

  testedit() {
    const formData = new FormData();
    formData.append('id', this.editform.get('product_id')?.value);
    formData.append('product_name', this.editform.get('product_name')?.value);
    formData.append('product_price', this.editform.get('product_price')?.value);
    formData.append('product_description', this.editform.get('product_description')?.value);
    const json = {
      'id': formData.get('id'),
      'product_name': formData.get('product_name'),
      'product_price': formData.get('product_price'),
      'product_description': formData.get('product_description')
    }
    this.api.updateProduct(json).subscribe((res: any) => {
      console.log(res);
      this.getproducts();
      this.closeeditpopup();
    }, (err: any) => { 
      console.log(err);
    })
  }

  closeeditpopup() {
    this.editpopup = false;
    this.editform.reset();
    window.scroll({ top: document.body.scrollTop, behavior:'smooth' });
  }
  // edit popup
}
