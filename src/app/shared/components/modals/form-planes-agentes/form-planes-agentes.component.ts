import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PlanesAgentesService } from 'src/app/shared/services/planes-agentes/planes-agentes.service';
import { CONFIG } from 'src/environments/configurations';

@Component({
  selector: 'app-form-planes-agentes',
  templateUrl: './form-planes-agentes.component.html',
  styleUrls: ['./form-planes-agentes.component.scss']
})
export class FormPlanesAgentesComponent implements OnInit {

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  numberConfig = CONFIG.NUMBER_DIRECTIVE;

  mainForm = new FormGroup({
    _id: new FormControl(null),
    nombre: new FormControl(null, [Validators.required]),
    precio: new FormControl(null, [Validators.required]),
    comision: new FormControl(null, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public planesAgentesService: PlanesAgentesService,
  ) {

    if (this.input.data) {
      this.mainForm.patchValue(this.input.data);
      this.mainForm.controls.precio.disable();
      this.mainForm.controls.comision.disable();
    }

  }

  ngOnInit(): void {
  }

  save() {

    const data = this.mainForm.getRawValue();

    this.triggedValidation(true);
    
    if (!this.mainForm.valid) {
      return;
    }
    
    this.utils.setLoading(true);

    const prom = (data._id) ? this.planesAgentesService.put(data._id, data) : this.planesAgentesService.post(data);
    prom.then(res => {
      if (res['response']) {
        this.dialogEvent.emit(true)
      } else {
        this.utils.fnError();
      }
      this.utils.setLoading(false);

    }).catch(err => {

      if (err['error']['message']) {
        this.utils.fnMainDialog("Error", err['error']['message'], "message");
      } else {
        this.utils.fnError();
      }
      this.utils.setLoading(false);
    });

  }

  get mf() {
    return this.mainForm.controls;
  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

}
