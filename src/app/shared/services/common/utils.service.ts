import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as $ from 'jquery';
import { MainMessageComponent } from '../../components/modals/main-message/main-message.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ENV } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public sidenavState = new Subject();
  public loginLoaderState = new Subject();
  public loginState = new Subject();
  public breadcrumbsState = new Subject();
  public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public loader = false;
  
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  fnGoTop() {
    $("#drw").animate({
      scrollTop: 0
    });
  }

  setLoading(event){
    this.loader = event;
  }

  fnSidenavState() {
    return {
      setSidenavState: (state: boolean) => {
        this.sidenavState.next(state)
      },
      getSidenavState: (): Observable<any> => {
        return this.sidenavState.asObservable();
      }
    }
  }

  fnBreadcrumbsState() {
    return {
      setBreadcrumbsState: (state: any) => {
        this.breadcrumbsState.next(state)
      },
      getBreadcrumbsState: (): Observable<any> => {
        return this.breadcrumbsState.asObservable();
      }
    }
  }

  fnLoginLoaderState() {
    return {
      setLoginLoaderState: (state: boolean) => {
        this.loginLoaderState.next(state)
      },
      getLoginLoaderState: (): Observable<any> => {
        return this.loginLoaderState.asObservable();
      }
    }
  }

  
  fnLoginState() {
    return {
        setLogin: (data: any) => {
            this.loginState.next(data)
        },
        getLogin: (): Observable<any> => {
            return this.loginState.asObservable();
        }
    }
}



  fnMessage(message) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  fnMainDialog(title: string, message: string, type: string, maxWidth = '480px') {
    
    let dialogConfirm = this.dialog.open(MainMessageComponent, {
      width: '90%',
      maxWidth: maxWidth,
      data: { title, message, type },
      autoFocus: false
    });

    return dialogConfirm.afterClosed();
  }

  setListEnviroment(data) {
    let listTipoCalificacion = [];
    Object.keys(data).forEach(key => {
      listTipoCalificacion.push(data[key]);
    });
    return listTipoCalificacion;
  }

  compareFn(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  fnError() {
    this.fnMainDialog('Error', "There was an error. Try again later.", "message");
  }

  fnSuccessSave() {
    this.fnMainDialog('Notification', "Data saved successfully.", "message");
  }

  fnErrorNoSave() {
    this.fnMainDialog('Error', "Data couldn't be saved. Try again later.", "message");
  }

  validateRun(run) {

    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(run)) {
      return false
    } else {
      const tmp = run.split('-');
      let digv = tmp[1];
      const rut = tmp[0];
      if (digv == 'K') digv = 'k';
      return (this.checkRunDv(rut) == (digv as string).toUpperCase());
    }

  }

  checkRunDv(T) {
    let M = 0, S = 1;
    for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
    return S ? S - 1 : 'K';
  }

  
  numberOnly(event, activate?: boolean): boolean {
    if (activate != undefined && !activate) {
      return;
    }

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validateEmail(correo) {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(correo) ? true : false;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(json);

    worksheet.A1.s = {
      bgColor: 'red'
    };
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);

  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  getModulos(){
    return ['ADMINS', 'BANNERS', 'EVENTS', 'FILES', 'ARTICLES', 
          'SOCIAL_POSTS', 'CATEGORIES_MANAGEMENT', 'SOCIAL_NETWORKS_USERS',
          'CONFIGURATIONS','PROFILE_IMAGES'];

  }
}
