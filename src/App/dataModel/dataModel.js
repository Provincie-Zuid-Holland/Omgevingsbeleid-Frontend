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
  "Opgave": {
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
  "Belang": {
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
            "UIVariables": {
              "UITitle": "Type",
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
              "UITitle": "Begin Geldigheid",
            }
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
            "UIVariables": {
              "UITitle": "Eigenaar 1",
            }
          }
      },
      "Eigenaar_2": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
            "UIVariables": {
              "UITitle": "Eigenaar 2",
            }
          }
      },
      "Portefeuillehouder_1": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
            "UIVariables": {
              "UITitle": "Portefeuillehouder 1",
            }
          }
      },
      "Portefeuillehouder_2": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
            "UIVariables": {
              "UITitle": "Portefeuillehouder 2",
            }
          }
      },
      "Opdrachtgever": {
        "type": "string",
        "format": "uuid",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectUser",
            "UIVariables": {
              "UITitle": "Opdrachtgever",
            }
          }
      },
      "Status": {
        "type": "string",
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "SelectStatus",
            "UIVariables": {
              "UITitle": "Selecteer een status",
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
      "Omschrijving_Keuze": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
            "UIVariables": {
              "UITitle": "Wat wil de provincie bereiken?",
            }
          }
      },
      "Omschrijving_Werking": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
            "UIVariables": {
              "UITitle": "Werking",
            }
          }
      },
      "Aanleiding": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
            "UIVariables": {
              "UITitle": "Aanleiding",
            }
          }
      },
      "Afweging": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
            "UIVariables": {
              "UITitle": "Afweging",
            }
          }
      },
      "Provinciaal_Belang": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextArea",
            "UIVariables": {
              "UITitle": "Provinciaal Belang",
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
              "UITitle": "IDSM",
            }
          }
      },
      "Besluitnummer": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TextInput",
            "UIVariables": {
              "UITitle": "Besluitnummer",
            }
          }
      },
      "Tags": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TagSelector",
            "UIVariables": {
              "UITitle": "Tags",
            }
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
            "UIVariables": {
              "UITitle": "Selecteer werkingsgebied",
            }
          }
      },
      "BeleidsRegels": {
        "default": [],
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Link_"
        },
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "KoppelingPopup",
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
            "UIVariables": {
              "UITitle": "Nationaal belang en Wettelijke taken & bevoegdheden",
            }
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
            "UIVariables": {
              "UITitle": "Koppeling",
            }
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
//   "Beleidsbeslissingen": {
//     "type": "object",
//     "properties": {
//       "ID": {
//         "type": "integer",
//         "format": "int32",
//         "UI": {
//             "userCRUD": false
//           }
//       },
//       "UUID": {
//         "type": "string",
//         "format": "uuid",
//         "UI": {
//             "userCRUD": false
//           }
//       },
//       "Begin_Geldigheid": {
//         "type": "string",
//         "format": "date-time",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "DateInput",
//             "UIVariables": {
//               "UITitle": "Begin Geldigheid",
//             }
//           }
//       },
//       "Eind_Geldigheid": {
//         "type": "string",
//         "format": "date-time",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "DateInput",
//             "UIVariables": {
//               "UITitle": "Begin Geldigheid",
//             }
//           }
//       },
//       "Created_By": {
//         "type": "string",
//         "format": "uuid",
//         "UI": {
//             "userCRUD": false
//           }
//       },
//       "Created_Date": {
//         "type": "string",
//         "format": "date-time",
//         "UI": {
//             "userCRUD": false
//           }
//       },
//       "Modified_By": {
//         "type": "string",
//         "format": "uuid",
//         "UI": {
//             "userCRUD": false
//           }
//       },
//       "Modified_Date": {
//         "type": "string",
//         "format": "date-time",
//         "UI": {
//             "userCRUD": false
//           }
//       },
//       "Eigenaar_1": {
//         "type": "string",
//         "format": "uuid",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "SelectUser",
//             "UIVariables": {
//               "UITitle": "Eigenaar 1",
//             }
//           }
//       },
//       "Eigenaar_2": {
//         "type": "string",
//         "format": "uuid",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "SelectUser",
//             "UIVariables": {
//               "UITitle": "Eigenaar 2",
//             }
//           }
//       },
//       "Portefeuillehouder": {
//         "type": "string",
//         "format": "uuid",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "SelectUser",
//             "UIVariables": {
//               "UITitle": "Portefeuillehouder",
//             }
//           }
//       },
//       "Status": {
//         "type": "string",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "SelectStatus",
//             "UIVariables": {
//               "UITitle": "Selecteer een status",
//             }
//           }
//       },
//       "Titel": {
//         "type": "string",
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextInput",
//             "UIVariables": {
//               "UITitle": "Titel",
//             }
//           }
//       },
//       "Omschrijving_Keuze": {
//         "type": "string",
//         "default": null,
//         "nullable": true,
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextArea",
//             "UIVariables": {
//               "UITitle": "Doel",
//             }
//           }
//       },
//       "Omschrijving_Werking": {
//         "type": "string",
//         "default": null,
//         "nullable": true,
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextArea",
//             "UIVariables": {
//               "UITitle": "Omschrijving Werking",
//             }
//           }
//       },
//       "Motivering": {
//         "type": "string",
//         "default": null,
//         "nullable": true,
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextArea",
//             "UIVariables": {
//               "UITitle": "Motivering",
//             }
//           }
//       },
//       "Aanleiding": {
//         "type": "string",
//         "default": null,
//         "nullable": true,
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextArea",
//             "UIVariables": {
//               "UITitle": "Aanleiding",
//             }
//           }
//       },
//       "Afweging": {
//         "type": "string",
//         "default": null,
//         "nullable": true,
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextArea",
//             "UIVariables": {
//               "UITitle": "Afweging",
//             }
//           }
//       },
//       "Verordening_Realisatie": {
//         "type": "string",
//         "default": null,
//         "nullable": true,
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "TextArea",
//             "UIVariables": {
//               "UITitle": "Verordening Realisatie",
//             }
//           }
//       },
//       "WerkingsGebieden": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "BeleidsRegels": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "Verordening": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "Maatregelen": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "Themas": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "Ambities": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "Doelen": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "ProvincialeBelangen": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       },
//       "Opgaven": {
//         "default": [],
//         "type": "array",
//         "items": {
//           "$ref": "#/components/schemas/Link_"
//         },
//         "UI": {
//             "userCRUD": true,
//             "CRUDComponent": "AlgemeneKoppeling",
//             "UIVariables": {
//               "UITitle": "Werkings Gebieden",
//             }
//         }
//       }
//     },
//     "required": [
//       "Begin_Geldigheid",
//       "Created_By",
//       "Created_Date",
//       "Eigenaar_1",
//       "Eigenaar_2",
//       "Eind_Geldigheid",
//       "Modified_By",
//       "Modified_Date",
//       "Portefeuillehouder",
//       "Status",
//       "Titel",
//       "UUID"
//     ],
//     "variables": {
//       "Titel_Enkelvoud": "Beleidsbeslissing",
//       "Titel_Meervoud": "Beleidsbeslissingen",
//       "Api_Endpoint": "beleidsbeslissingen",
//       "Overzicht_Slug": "beleidsbeslissingen",
//       "Create_New_Slug": "nieuwe-beleidsbeslissing",
//       "Object_Name": "Beleidsbeslissing"
//     }
//   },
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
    //   "Beleids_Document": {
    //     "type": "string",
    //     "default": null,
    //     "nullable": true,
    //     "UI": {
    //       "userCRUD": true,
    //       "CRUDComponent": "TextField",
    //       "UIVariables": {
    //         "UITitle": "Beleids Document",
    //       }
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
      },
      "Tags": {
        "type": "string",
        "default": null,
        "nullable": true,
        "UI": {
            "userCRUD": true,
            "CRUDComponent": "TagSelector",
            "UIVariables": {
              "UITitle": "Tags",
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
  "Thema": {
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
      "UUID",
      "Weblink"
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