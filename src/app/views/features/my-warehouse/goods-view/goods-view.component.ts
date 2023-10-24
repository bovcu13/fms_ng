import { Component, Input } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-goods-view',
    templateUrl: './goods-view.component.html',
    styleUrls: ['./goods-view.component.scss']
})
export class GoodsViewComponent {
    @Input() productId: any; // 定義 productId 作為輸入屬性

    goodsData = [
        {
            id: 1,
            name: '筆記本電腦',
            spec: '15吋, Intel Core i7, 512GB SSD',
            quantity: 2,
            unit: '台',
            price: 999.99,
            total: 1999.98,
        },
        {
            id: 2,
            name: '4K LED 電視',
            spec: '55吋, Smart TV',
            quantity: 1,
            unit: '台',
            price: 699.99,
            total: 699.99,
        },
        {
            id: 3,
            name: '耳機',
            spec: '無線藍牙, 降噪功能',
            quantity: 5,
            unit: '對',
            price: 149.99,
            total: 749.95,
        },
        {
            id: 4,
            name: '咖啡機',
            spec: '單杯咖啡機, 咖啡膠囊',
            quantity: 3,
            unit: '台',
            price: 79.99,
            total: 239.97,
        }
    ];

    images: any[] = [
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
            alt: 'Description for Image 1',
            title: 'Title 1'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
            alt: 'Description for Image 2',
            title: 'Title 2'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg',
            alt: 'Description for Image 3',
            title: 'Title 3'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg',
            alt: 'Description for Image 4',
            title: 'Title 4'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg',
            alt: 'Description for Image 5',
            title: 'Title 5'
        },
    ];

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    editGoods_form: FormGroup;

    constructor(
        private carServ: CarService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.editGoods_form = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            spec: [''],
            quantity: ['', Validators.required],
            unit: ['', Validators.required],
            price: ['', Validators.required],
            total: ['', Validators.required],
            created_at: [''],
            created_by: [''],
            updated_at: [''],
            updated_by: [''],
        });
    }

    ngOnInit(): void {
        this.editGoods_form.patchValue(this.goodsData[this.productId - 1])
    }
}
