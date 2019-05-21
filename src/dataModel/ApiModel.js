export default 
{
  "Ambitie": {
    "type": "object",
    "properties": {
      "ID": {
        "type": "integer",
        "format": "int32",
        "userCRUD": false
      },
      "UUID": {
        "type": "string",
        "format": "uuid",
        "userCRUD": false
      },
      "Begin_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "userCRUD": true
      },
      "Eind_Geldigheid": {
        "type": "string",
        "format": "date-time",
        "userCRUD": true
      },
      "Created_By": {
        "type": "string",
        "format": "uuid",
        "userCRUD": false
      },
      "Created_Date": {
        "type": "string",
        "format": "date-time",
        "userCRUD": false
      },
      "Modified_By": {
        "type": "string",
        "format": "uuid",
        "userCRUD": false
      },
      "Modified_Date": {
        "type": "string",
        "format": "date-time",
        "userCRUD": false
      },
      "Titel": {
        "type": "string",
        "userCRUD": true
      },
      "Omschrijving": {
        "type": "string",
        "default": null,
        "nullable": true,
        "userCRUD": true
      },
      "Weblink": {
        "type": "string",
        "default": null,
        "nullable": true,
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