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
}