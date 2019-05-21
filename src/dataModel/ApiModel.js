export default 
{
  "Ambitie": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "userView": false,
        "userCRUD": false
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "userView": true,
        "userCRUD": false
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "userView": true,
        "userCRUD": true
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "userView": true,
        "userCRUD": true
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "userView": true,
        "userCRUD": false
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "userView": true,
        "userCRUD": false
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "userView": false,
        "userCRUD": false
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "userView": true,
        "userCRUD": false
      },
      "Titel": {
        "type": "string",
        "userView": true,
        "userCRUD": true
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "userView": true,
        "userCRUD": true
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
        "userView": true,
        "userCRUD": true
      }
    },
    "variables": {
      "Titel_Enkelvoud": "Ambitie",
      "Titel_Meervoud": "Ambities",
      "Api_Endpoint": "ambities",
      "Overzicht_Slug": "ambities",
      "Create_New_Slug": "nieuwe-ambitie"
    }
  },
}