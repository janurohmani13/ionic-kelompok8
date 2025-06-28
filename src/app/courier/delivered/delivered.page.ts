import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivered',
  templateUrl: './delivered.page.html',
  styleUrls: ['./delivered.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DeliveredPage implements OnInit {
  searchQuery = '';
  searchActive = false;
  searchHistory: string[] = [];
  segment = 'tambah';
  selectedPackage: number | null = null;

  expressPackages = [
    { id: 1, name: 'James Drown', address: 'Jl. KH. Mas Mansyur No.75' },
    { id: 2, name: 'Camel Rine', address: 'Jl. Marina Raya No.6' },
  ];

  regulerPackages = [
    { id: 3, name: 'Lucky', address: 'Jl. Kamal Raya No. 8' },
    { id: 4, name: 'Ryan', address: 'Jl. Kebon Jeruk III No.1' },
  ];

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadSearchHistory();
  }

  filterSegment() {
    console.log('Segment selected:', this.segment);
    // Optional: logic to filter express/reguler based on selected segment
  }

  openDetail(paket: any) {
    this.router.navigate(['/detail'], { state: { paket } });
  }

  updateStatus() {
    if (!this.selectedPackage) {
      alert('Pilih paket terlebih dahulu.');
      return;
    }
    console.log('Status diperbarui untuk paket ID:', this.selectedPackage);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.menuCtrl.close();
  }

  showSearchOverlay() {
    this.searchActive = true;
  }

  closeSearchOverlay() {
    this.searchActive = false;
    this.searchQuery = '';
  }

  onSearchInput(event: any) {
    const value = event.target.value?.trim();
    this.searchQuery = value;

    if (value && value.length > 1 && !this.searchHistory.includes(value)) {
      this.saveToSearchHistory(value);
    }
  }

  saveToSearchHistory(query: string) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!history.includes(query)) {
      history.unshift(query);
      if (history.length > 10) history.pop();
      localStorage.setItem('searchHistory', JSON.stringify(history));
      this.searchHistory = history;
    }
  }

  async openUserMenu(event: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'User Options',
      buttons: [
        {
          text: 'Account Settings',
          icon: 'settings-outline',
          handler: () => this.navigateTo('courier/account-settings'),
        },
        {
          text: 'Logout',
          icon: 'log-out-outline',
          handler: () => this.logout(),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });
    await actionSheet.present();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['courier/login']);
  }

  loadSearchHistory() {
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  }

  clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    this.searchHistory = [];
  }

  removeFromHistory(term: string) {
    this.searchHistory = this.searchHistory.filter(t => t !== term);
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }
}
