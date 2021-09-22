/**
 * Used to build up the menu where a user can filter nodes based on the type.
 * The key is the sub title of the menu. The values are the filterable types.
 */
const networkGraphFilterMenu = {
    Visie: ["ambities", "beleidsdoelen", "beleidskeuzes", "beleidsprestaties"],
    Omgevingsprogramma: ["maatregelen"],
    Uitvoering: ["verordeningen", "beleidsregels"],
    Overig: ["themas", "belangen"],
}

export default networkGraphFilterMenu
