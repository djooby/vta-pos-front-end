"use client"
import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

export default function EnterpriseForm(props: any) {

  const [editedData, setEditedData] = useState({
    nom: props.enterpriseInfo?.nom,
    patente: props.enterpriseInfo?.patente,
    adresse: props.enterpriseInfo?.adresse,
    email: props.enterpriseInfo?.email,
    telephone: props.enterpriseInfo?.telephone,
  });

  const onInputChange = (e: any) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="col-12 lg:col-9">
    <div className="grid formgrid p-fluid">
      <div className="field mb-4 col-12">
        <label htmlFor="nom" className="font-medium text-900">
          Nom
        </label>
        <InputText
          onChange={onInputChange}
          id="nom"
          type="text"
          value={props.enterpriseInfo?.nom}
        />
      </div>

      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="patente" className="font-medium text-900">
          Patente
        </label>
        <InputMask
          mask="999-999-999-9"
          placeholder="xxx-xxx-xxx-x"
          id="patente"
          type="text"
          value={props.enterpriseInfo?.patente}
        />
      </div>
      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="telephone" className="font-medium text-900">
          Telephone
        </label>
        <InputMask
          id="telephone"
          value={props.enterpriseInfo?.telephone}
          mask="(999) 9999-9999"
          placeholder="Telephone de l'entreprise"
        />
      </div>
      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="email" className="font-medium text-900">
          Email
        </label>
        <InputText id="email" type="text" value={props.enterpriseInfo?.email} />
      </div>

      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="adresse" className="font-medium text-900">
          Adresse
        </label>
        <InputText id="adresse" value={props.enterpriseInfo?.adresse} />
      </div>

      <div className="col-12">
        <Button
          label="Enregistrer modifications"
          className="w-auto mt-3"
        ></Button>
      </div>
      
    </div>
  </div>
  )
}
