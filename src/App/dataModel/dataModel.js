// Het data model is verantwoordelijk voor het juist genereren van de componenten waarmee de UI wordt opgebouwd.
// De volgende dingen staan vastgelegd in de structuur:
// - De verschillende dimensies (Ambitie, Opgaven, etc)
//  -> De properties van dit object (UUID, ID, Begin_Geldigheid, etc)
//      -> 

export default 
{
  "Ambities": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      }
    },
    "variables": {
      "Titel_Enkelvoud": "Ambitie",
      "Titel_Meervoud": "Ambities",
      "Api_Endpoint": "ambities",
      "Overzicht_Slug": "ambities",
      "Create_New_Slug": "nieuwe-ambitie",
      "Object_Name": "Ambitie"
    },
    "required": [
        "Begin_Geldigheid",
        "Created_By",
        "Created_Date",
        "Eind_Geldigheid",
        "Modified_By",
        "Modified_Date",
        "Titel",
        "UUID"
    ]
  },
  "Opgaven": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false,
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "UUID"
    ],
    "variables": {
      "Titel_Enkelvoud": "Opgave",
      "Titel_Meervoud": "Opgaven",
      "Api_Endpoint": "opgaven",
      "Overzicht_Slug": "opgaven",
      "Create_New_Slug": "nieuwe-opgave",
      "Object_Name": "Opgave"
    }
  },
  "Beleidsregels": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false,
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
        
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "UUID"
    ],
    "variables": {
      "Titel_Enkelvoud": "Beleidsregel",
      "Titel_Meervoud": "Beleidsregels",
      "Api_Endpoint": "beleidsregels",
      "Overzicht_Slug": "beleidsregels",
      "Create_New_Slug": "nieuwe-beleidsregel",
      "Object_Name": "BeleidsRegel"
    }
  },
  "Doelen": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "UUID"
    ],
    "variables": {
      "Titel_Enkelvoud": "Doel",
      "Titel_Meervoud": "Doelen",
      "Api_Endpoint": "doelen",
      "Overzicht_Slug": "doelen",
      "Create_New_Slug": "nieuw-doel",
      "Object_Name": "Doel"
    }
  },
  "ProvincialeBelangen": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "UUID"
    ],
    "variables": {
      "Titel_Enkelvoud": "Provinciaal Belang",
      "Titel_Meervoud": "Provinciale Belangen",
      "Api_Endpoint": "provincialebelangen",
      "Overzicht_Slug": "provinciale-belangen",
      "Create_New_Slug": "nieuw-belang",
      "Object_Name": "ProvincialeBelangen"
    }
  },
  "Belangen": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
            "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": false
          }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Type": {
        "type": "string",
        "enum": [
          "Nationaal Belang",
          "Wettelijke Taak & Bevoegdheid"
        ],
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "BelangType",
          }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "Type",
      "UUID"
    ],
    "variables": {
        "Titel_Enkelvoud": "Belang",
        "Titel_Meervoud": "Belangen",
        "Api_Endpoint": "belangen",
        "Overzicht_Slug": "belangen",
        "Create_New_Slug": "nieuw-belang",
        "Object_Name": "Belang"
      }
  },
  "Beleidsrelaties": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Van_Beleidsbeslissing": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Naar_Beleidsbeslissing": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextInput",
          }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Status": {
        "type": "string",
        "enum": [
          "Open",
          "Akkoord",
          "NietAkkoord"
        ],
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Aanvraag_Datum": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Datum_Akkoord": {
        "type": "string",
        "format": "date-time",
        "nullable": true,
        "UI": {
          "userCRUD": false,
        }
      }
    },
    "required": [
      "Aanvraag_Datum",
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Naar_Beleidsbeslissing",
      "Status",
      "UUID",
      "Van_Beleidsbeslissing"
    ],
    "variables": {
      "Titel_Enkelvoud": "Beleidsrelatie",
      "Titel_Meervoud": "Beleidsrelaties",
      "Api_Endpoint": "beleidsrelaties",
      "Overzicht_Slug": "beleidsrelaties",
      "Create_New_Slug": "nieuwe-beleidsrelatie",
      "Object_Name": "BeleidsRelatie"
    }
  },
  "Beleidsbeslissingen": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
            "userCRUD": false
          }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": false
          }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "DateInput",
          }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "DateInput",
          }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": false
          }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
            "userCRUD": false
          }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": false
          }

      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
            "userCRUD": false
          }
      },
      "Eigenaar_1": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
          }
      },
      "Eigenaar_2": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
          }
      },
      "Portefeuillehouder_1": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
          }
      },
      "Portefeuillehouder_2": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
          }
      },
      "Opdrachtgever": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
          }
      },
      "Status": {
        "type": "string",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectStatus",
          }
      },
      "Titel": {
        "type": "string",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextInput",
          }
      },
      "Omschrijving_Keuze": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
          }
      },
      "Omschrijving_Werking": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
          }
      },
      "Aanleiding": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
          }
      },
      "Afweging": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
          }
      },
      "Provinciaal_Belang": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
          }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextInput",
          }
      },
      "Besluitnummer": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextInput",
          }
      },
      "Tags": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TagSelector",
          }
      },
      "WerkingsGebieden": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "WerkingsgebiedSelectorPopup",
          }
      },
      "Beleidsregels": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      },
      "Verordening": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      },
      "Maatregelen": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      },
      "Themas": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      },
      "Ambities": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      },
      "Doelen": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      },
      "Belangen": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "BelangPopup",
          }
      },
      "Opgaven": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
          }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eigenaar_1",
      "Eigenaar_2",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Opdrachtgever",
      "Portefeuillehouder_1",
      "Portefeuillehouder_2",
      "Status",
      "Titel",
      "UUID"
    ],
    "variables": {
        "Titel_Enkelvoud": "Beleidsbeslissing",
        "Titel_Meervoud": "Beleidsbeslissingen",
        "Api_Endpoint": "beleidsbeslissingen",
        "Overzicht_Slug": "beleidsbeslissingen",
        "Create_New_Slug": "nieuwe-beleidsbeslissing",
        "Object_Name": "Beleidsbeslissing"
      }
  },
  "Maatregelen": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
    //   "Beleids_Document": {
    //     "type": "string",
    //     "default": null,
    //     "nullable": true,
    //     "UI": {
    //       "userCRUD": true,
    //       "CRUDComponent": "TextField",
    //     }
    //   },
      "Gebied": {
        "type": "string",
        "format": "uuid",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "Select",
        }
      },
      "Verplicht_Programma": {
        "type": "string",
        "default": null,
        "enum": [
          "Ja",
          "Nee"
        ],
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextField",
        }
      },
      "Specifiek_Of_Generiek": {
        "type": "string",
        "default": null,
        "enum": [
          "Gebiedsspecifiek",
          "Generiek"
        ],
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextField",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Tags": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TagSelector",
          }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "UUID"
    ],
    "variables": {
      "Titel_Enkelvoud": "Maatregel",
      "Titel_Meervoud": "Maatregelen",
      "Api_Endpoint": "maatregelen",
      "Overzicht_Slug": "maatregelen",
      "Create_New_Slug": "nieuwe-maatregel",
      "Object_Name": "Maatregelen"
    }
  },
  "Thema's": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Titel",
      "UUID"
    ],
    "variables": {
      "Titel_Enkelvoud": "Thema",
      "Titel_Meervoud": "Thema's",
      "Api_Endpoint": "themas",
      "Overzicht_Slug": "themas",
      "Create_New_Slug": "nieuw-thema",
      "Object_Name": "Themas"
    }
  },
  "Verordeningen": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "UI": {
          "userCRUD": false
        }
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false
        }
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
        }
      },
      "Status": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Type": {
        "type": "string",
        "enum": [
          "Hoofdstuk",
          "Afdeling",
          "Paragraaf",
          "Artikel"
        ],
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "Select",
        }
      },
      "Volgnummer": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
        }
      },
      "Werkingsgebied": {
        "type": "string",
        "format": "uuid",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "Select",
        }
      }
    },
    "required": [
      "Begin_Geldigheid",
      "Created_By",
      "Created_Date",
      "Eind_Geldigheid",
      "Modified_By",
      "Modified_Date",
      "Status",
      "Titel",
      "Type",
      "UUID",
      "Volgnummer"
    ],
    "variables": {
      "Titel_Enkelvoud": "Verordening",
      "Titel_Meervoud": "Verordeningen",
      "Api_Endpoint": "verordeningstructuur",
      "Overzicht_Slug": "verordeningen",
      "Create_New_Slug": "nieuwe-verordening",
      "Object_Name": "Verordening"
    }
  }
}