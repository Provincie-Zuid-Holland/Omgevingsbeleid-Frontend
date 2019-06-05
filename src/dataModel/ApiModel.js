export default 
{
  "Ambitie": {
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Weblink",
          }
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
    }
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Weblink",
          }
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
  "BeleidsRegel": {
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Weblink",
          }
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
  "Doel": {
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Weblink",
          }
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Weblink",
          }
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
  "BeleidsRelatie": {
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Van_Beleidsbeslissing": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Van Beleidsbeslissing",
          }
        }
      },
      "Naar_Beleidsbeslissing": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Van Beleidsbeslissing",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
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
          "UIVariables": {
            "UITitle": "Status",
          }
        }
      },
      "Aanvraag_Datum": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Aanvraag Datum",
          }
        }
      },
      "Datum_Akkoord": {
        "type": "string",
        "format": "date-time",
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Datum Akkoord",
          }
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Motivering": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Motivering",
          }
        }
      },
      "Beleids_Document": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextField",
          "UIVariables": {
            "UITitle": "Beleids Document",
          }
        }
      },
      "Gebied": {
        "type": "string",
        "format": "uuid",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "Select",
          "UIVariables": {
            "UITitle": "Gebied",
          }
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
          "UIVariables": {
            "UITitle": "Verplicht Programma",
          }
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
          "UIVariables": {
            "UITitle": "Specifiek of Generiek",
          }
        }
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Weblink",
          }
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
  "Themas": {
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
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
  "Verordening": {
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
          "UIVariables": {
            "UITitle": "Eigenaar",
          }
        }
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Begin Geldigheid",
          }
        }
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "DateInput",
          "UIVariables": {
            "UITitle": "Eind Geldigheid",
          }
        }
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt Door",
          }
        }
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "UI": {
          "userCRUD": false,
          "UIVariables": {
            "UITitle": "Aangemaakt op",
          }
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
          "UIVariables": {
            "UITitle": "Laatste Wijziging",
          }
        }
      },
      "Titel": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Titel",
          }
        }
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextArea",
          "UIVariables": {
            "UITitle": "Omschrijving",
          }
        }
      },
      "Status": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Status",
          }
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
          "UIVariables": {
            "UITitle": "Type",
          }
        }
      },
      "Volgnummer": {
        "type": "string",
        "UI": {
          "userCRUD": true,
          "CRUDComponent": "TextInput",
          "UIVariables": {
            "UITitle": "Volgnummer",
          }
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
          "UIVariables": {
            "UITitle": "Gebied",
          }
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
      "Api_Endpoint": "verordeningen",
      "Overzicht_Slug": "verordeningen",
      "Create_New_Slug": "nieuwe-verordening",
      "Object_Name": "Verordening"
    }
  }
}