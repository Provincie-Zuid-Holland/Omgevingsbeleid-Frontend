/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Omgevingsbeleid API
 * 
        This API serves all the object that make up the policies 
        of a provincial government. 
        
 * OpenAPI spec version: 3.0-alpha
 */
export type PasswordResetPostParams = {
    password: string
    new_password: string
}

export type ObjectsValidGetParams = {
    owner_uuid?: string
    object_type?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectsLatestGetParams = {
    object_type?: string
    owner_uuid?: string
    minimum_status?: ModuleStatusCode
    action?: ModuleObjectActionFilter
    only_active_modules?: boolean
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesGetParams = {
    only_mine?: boolean
    only_active?: boolean
    offset?: number
    limit?: number
    sort?: string
    object_type?: string
    lineage_id?: number
}

export type ObjectGraphGetParams = {
    uuid: string
}

export type SearchValidPostParams = {
    query: string
    offset?: number
    limit?: number
    sort?: string
}

export type SearchPostParams = {
    query: string
    offset?: number
    limit?: number
    sort?: string
}

export type SearchGeoPostParams = {
    offset?: number
    limit?: number
    sort?: string
}

export type WerkingsgebiedenGetParams = {
    offset?: number
    limit?: number
    sort?: string
}

export type UsersGetParams = {
    offset?: number
    limit?: number
    sort?: string
}

export type WettelijkeTaakValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type VerplichtProgrammaValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type NationaalBelangValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectsMaatregelActiveLineageIdGetParams = {
    minimum_status?: ModuleStatusCode
}

export type ModulesModuleIdObjectMaatregelLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type MaatregelenValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type MaatregelenValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectsGebiedsprogrammaActiveLineageIdGetParams = {
    minimum_status?: ModuleStatusCode
}

export type ModulesModuleIdObjectGebiedsprogrammasLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type GebiedsprogrammasValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type GebiedsprogrammasValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectsBeleidsregelActiveLineageIdGetParams = {
    minimum_status?: ModuleStatusCode
}

export type ModulesModuleIdObjectBeleidsregelLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type BeleidsregelsValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type BeleidsregelsValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectsBeleidskeuzeActiveLineageIdGetParams = {
    minimum_status?: ModuleStatusCode
}

export type ModulesModuleIdObjectBeleidskeuzeLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type BeleidskeuzeAcknowledgedRelationsLineageIdGetParams = {
    requested_by_us?: boolean
    acknowledged?: boolean
    show_inactive?: boolean
}

export type BeleidskeuzesValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type BeleidskeuzesValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectBeleidsdoelActiveLineageIdGetParams = {
    minimum_status?: ModuleStatusCode
}

export type ModulesModuleIdObjectBeleidsdoelLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type BeleidsdoelenValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type BeleidsdoelenValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type ModulesObjectAmbitieActiveLineageIdGetParams = {
    minimum_status?: ModuleStatusCode
}

export type ModulesModuleIdObjectAmbitieLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type AmbitiesValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export type AmbitiesValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
    sort?: string
}

export interface WriteRelation {
    Object_ID: number
    Object_Type: string
    Description?: string | null
}

export interface WettelijkeTaakUUID {
    Object_ID?: number
    UUID?: string
}

export interface WettelijkeTaakStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export interface WettelijkeTaakMinimal {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
}

export interface WettelijkeTaakFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
}

export type WettelijkeTaakFullObjectStatics = WettelijkeTaakFullStatics | null

export interface WettelijkeTaakFull {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    VerplichtProgrammas?: VerplichtProgrammaMinimal[]
    Beleidskeuzes?: ReadRelationShortBeleidskeuzeMinimal[]
    ObjectStatics?: WettelijkeTaakFullObjectStatics
}

export interface WettelijkeTaakEdit {
    Title?: string | null
    Weblink?: string | null
}

export interface WettelijkeTaakCreateStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export type WettelijkeTaakCreateObjectStatics =
    WettelijkeTaakCreateStatics | null

export interface WettelijkeTaakCreate {
    Title?: string
    Weblink?: string | null
    ObjectStatics?: WettelijkeTaakCreateObjectStatics
}

export interface WettelijkeTaakBasic {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
}

export interface Werkingsgebied {
    ID: number
    UUID: string
    Created_Date: string
    Modified_Date: string
    Title: string
}

export interface VerplichtProgrammaUUID {
    Object_ID?: number
    UUID?: string
}

export interface VerplichtProgrammaStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export interface VerplichtProgrammaMinimal {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
}

export interface VerplichtProgrammaFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
}

export type VerplichtProgrammaFullObjectStatics =
    VerplichtProgrammaFullStatics | null

export interface VerplichtProgrammaFull {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    WettelijkeTaken?: WettelijkeTaakMinimal[]
    Maatregelen?: ReadRelationShortMaatregelMinimal[]
    ObjectStatics?: VerplichtProgrammaFullObjectStatics
}

export interface VerplichtProgrammaEdit {
    Title?: string | null
    Description?: string | null
}

export interface VerplichtProgrammaCreateStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export type VerplichtProgrammaCreateObjectStatics =
    VerplichtProgrammaCreateStatics | null

export interface VerplichtProgrammaCreate {
    Title?: string
    Description?: string | null
    ObjectStatics?: VerplichtProgrammaCreateObjectStatics
}

export interface VerplichtProgrammaBasic {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
}

export type ValidationErrorLocItem = string | number

export interface ValidationError {
    loc: ValidationErrorLocItem[]
    msg: string
    type: string
}

export interface ValidSearchObject {
    UUID: string
    Object_Type: string
    Object_ID: number
    Title: string
    Description: string
    Score: number
}

export interface UserShort {
    UUID: string
    Rol: string
    Gebruikersnaam: string
}

export interface SearchRequestData {
    Object_Types?: string[]
}

export interface SearchObject {
    UUID: string
    Object_Type: string
    Object_ID: number
    Title: string
    Description: string
    Score: number
    Module_ID?: number
}

export interface SearchGeoRequestData {
    Object_Types?: string[]
    Area_List: string[]
}

export interface ResponseOK {
    message: string
}

export interface RequestAcknowledgedRelation {
    Object_ID: number
    Object_Type: string
    Explanation?: string
}

export interface ReadRelationShort {
    Object_ID: number
    Object_Type: string
    Description?: string | null
}

export interface ReadRelationShortWettelijkeTaakMinimal {
    Relation: ReadRelationShort
    Object: WettelijkeTaakMinimal
}

export interface ReadRelationShortNationaalBelangMinimal {
    Relation: ReadRelationShort
    Object: NationaalBelangMinimal
}

export interface ReadRelationShortMaatregelMinimal {
    Relation: ReadRelationShort
    Object: MaatregelMinimal
}

export interface ReadRelationShortGebiedsprogrammaMinimal {
    Relation: ReadRelationShort
    Object: GebiedsprogrammaMinimal
}

export interface ReadRelationShortBeleidsregelMinimal {
    Relation: ReadRelationShort
    Object: BeleidsregelMinimal
}

export interface ReadRelationShortBeleidskeuzeMinimal {
    Relation: ReadRelationShort
    Object: BeleidskeuzeMinimal
}

export interface ReadRelationShortBeleidsdoelMinimal {
    Relation: ReadRelationShort
    Object: BeleidsdoelMinimal
}

export interface ReadRelationShortAmbitieMinimal {
    Relation: ReadRelationShort
    Object: AmbitieMinimal
}

export interface ReadRelation {
    Object_ID: number
    Object_Type: string
    Description?: string | null
    Title?: string | null
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseWettelijkeTaakBasic {
    total: number
    offset?: number
    limit?: number
    results: WettelijkeTaakBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseWerkingsgebied {
    total: number
    offset?: number
    limit?: number
    results: Werkingsgebied[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseVerplichtProgrammaBasic {
    total: number
    offset?: number
    limit?: number
    results: VerplichtProgrammaBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseValidSearchObject {
    total: number
    offset?: number
    limit?: number
    results: ValidSearchObject[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseUserShort {
    total: number
    offset?: number
    limit?: number
    results: UserShort[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseSearchObject {
    total: number
    offset?: number
    limit?: number
    results: SearchObject[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseNationaalBelangBasic {
    total: number
    offset?: number
    limit?: number
    results: NationaalBelangBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseModule {
    total: number
    offset?: number
    limit?: number
    results: Module[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseModuleObjectShortStatus {
    total: number
    offset?: number
    limit?: number
    results: ModuleObjectShortStatus[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseMaatregelExtended {
    total: number
    offset?: number
    limit?: number
    results: MaatregelExtended[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseMaatregelBasic {
    total: number
    offset?: number
    limit?: number
    results: MaatregelBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseGeoSearchResult {
    total: number
    offset?: number
    limit?: number
    results: GeoSearchResult[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseGenericObjectShort {
    total: number
    offset?: number
    limit?: number
    results: GenericObjectShort[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseGebiedsprogrammaExtended {
    total: number
    offset?: number
    limit?: number
    results: GebiedsprogrammaExtended[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseGebiedsprogrammaBasic {
    total: number
    offset?: number
    limit?: number
    results: GebiedsprogrammaBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseBeleidsregelExtended {
    total: number
    offset?: number
    limit?: number
    results: BeleidsregelExtended[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseBeleidsregelBasic {
    total: number
    offset?: number
    limit?: number
    results: BeleidsregelBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseBeleidskeuzeExtended {
    total: number
    offset?: number
    limit?: number
    results: BeleidskeuzeExtended[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseBeleidskeuzeBasic {
    total: number
    offset?: number
    limit?: number
    results: BeleidskeuzeBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseBeleidsdoelExtended {
    total: number
    offset?: number
    limit?: number
    results: BeleidsdoelExtended[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseBeleidsdoelBasic {
    total: number
    offset?: number
    limit?: number
    results: BeleidsdoelBasic[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseAmbitieExtended {
    total: number
    offset?: number
    limit?: number
    results: AmbitieExtended[]
}

/**
 * Wrap any response schema and add pagination metadata.
 */
export interface PagedResponseAmbitieBasic {
    total: number
    offset?: number
    limit?: number
    results: AmbitieBasic[]
}

export interface ObjectStaticShort {
    Owner_1_UUID?: string
    Owner_2_UUID?: string
}

export interface ObjectSpecifiekeGeldigheid {
    Object_Type: string
    Object_ID: number
    Start_Validity?: string | null
}

export interface NewObjectStaticResponse {
    Object_Type: string
    Object_ID: number
    Code: string
}

export interface NationaalBelangUUID {
    Object_ID?: number
    UUID?: string
}

export interface NationaalBelangStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export interface NationaalBelangMinimal {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
}

export interface NationaalBelangFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
}

export type NationaalBelangFullObjectStatics = NationaalBelangFullStatics | null

export interface NationaalBelangFull {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    Beleidskeuzes?: BeleidskeuzeMinimal[]
    ObjectStatics?: NationaalBelangFullObjectStatics
}

export interface NationaalBelangEdit {
    Title?: string | null
    Weblink?: string | null
}

export interface NationaalBelangCreateStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export type NationaalBelangCreateObjectStatics =
    NationaalBelangCreateStatics | null

export interface NationaalBelangCreate {
    Title?: string
    Weblink?: string | null
    ObjectStatics?: NationaalBelangCreateObjectStatics
}

export interface NationaalBelangBasic {
    Object_Type?: string
    Object_ID?: number
    Code?: string
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
}

/**
 * An enumeration.
 */
export type ModuleStatusCode =
    typeof ModuleStatusCode[keyof typeof ModuleStatusCode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ModuleStatusCode = {
    'Niet-Actief': 'Niet-Actief',
    Ontwerp_GS_Concept: 'Ontwerp GS Concept',
    Ontwerp_GS: 'Ontwerp GS',
    Definitief_ontwerp_GS: 'Definitief ontwerp GS',
    Ontwerp_PS_Concept: 'Ontwerp PS Concept',
    Ontwerp_PS: 'Ontwerp PS',
    Definitief_ontwerp_PS: 'Definitief ontwerp PS',
    Vastgesteld: 'Vastgesteld',
} as const

export interface ModuleStatus {
    ID: number
    Module_ID: number
    Status: string
    Created_Date: string
    Created_By_UUID: string
}

export type ModuleSnapshotObjectsItem = { [key: string]: any }

export interface ModuleSnapshot {
    Objects: ModuleSnapshotObjectsItem[]
}

export interface ModuleShort {
    Module_ID: number
    Closed: boolean
    Title: string
    Description: string
    Status?: ModuleStatus
    Module_Manager_1?: UserShort
    Module_Manager_2?: UserShort
}

export interface ModulePatchStatus {
    Status: ModuleStatusCode
}

export interface ModuleObjectContextShort {
    Action: string
    Original_Adjust_On?: string
}

export interface ModuleObjectShortStatus {
    Module_ID: number
    Object_Type: string
    Object_ID: number
    Code: string
    UUID: string
    Modified_Date: string
    Title: string
    ObjectStatics?: ObjectStaticShort
    ModuleObjectContext?: ModuleObjectContextShort
    Status: ModuleStatusCode
}

export interface ModuleObjectShort {
    Module_ID: number
    Object_Type: string
    Object_ID: number
    Code: string
    UUID: string
    Modified_Date: string
    Title: string
    ObjectStatics?: ObjectStaticShort
    ModuleObjectContext?: ModuleObjectContextShort
}

export interface ModuleOverview {
    Module: Module
    StatusHistory: ModuleStatus[]
    Objects: ModuleObjectShort[]
}

export interface ModuleObjectContext {
    Module_ID: number
    Object_Type: string
    Object_ID: number
    Code: string
    Created_Date: string
    Modified_Date: string
    Action: string
    Explanation: string
    Conclusion: string
    Original_Adjust_On?: string
    Created_By?: UserShort
    Modified_By?: UserShort
}

/**
 * An enumeration.
 */
export type ModuleObjectActionFilter =
    typeof ModuleObjectActionFilter[keyof typeof ModuleObjectActionFilter]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ModuleObjectActionFilter = {
    Create: 'Create',
    Edit: 'Edit',
    Terminate: 'Terminate',
} as const

/**
 * An enumeration.
 */
export type ModuleObjectAction =
    typeof ModuleObjectAction[keyof typeof ModuleObjectAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ModuleObjectAction = {
    Edit: 'Edit',
    Terminate: 'Terminate',
} as const

export type ModuleEditObjectContextAction = ModuleObjectAction | null

export interface ModuleEditObjectContext {
    Action?: ModuleEditObjectContextAction
    Explanation?: string | null
    Conclusion?: string | null
}

export interface ModuleEdit {
    Temporary_Locked?: boolean | null
    Title?: string | null
    Description?: string | null
    Module_Manager_1_UUID?: string | null
    Module_Manager_2_UUID?: string | null
}

export interface ModuleCreatedResponse {
    Module_ID: number
}

export interface ModuleCreate {
    Title: string
    Description: string
    Module_Manager_1_UUID: string
    Module_Manager_2_UUID?: string | null
}

export interface ModuleAddNewObject {
    Object_Type: string
    Title: string
    Owner_1_UUID: string
    Owner_2_UUID?: string | null
    Client_1_UUID?: string | null
    Explanation?: string | null
    Conclusion?: string | null
}

export interface ModuleAddExistingObject {
    Object_UUID: string
    Action: ModuleObjectAction
    Explanation?: string | null
    Conclusion?: string | null
}

export interface Module {
    Module_ID: number
    Created_Date: string
    Modified_Date: string
    Created_By_UUID: string
    Modified_By_UUID: string
    Activated: boolean
    Closed: boolean
    Successful: boolean
    Temporary_Locked: boolean
    Title: string
    Description: string
    Module_Manager_1_UUID: string
    Module_Manager_2_UUID?: string | null
    Status?: ModuleStatus
    Created_By?: UserShort
    Modified_By?: UserShort
    Module_Manager_1?: UserShort
    Module_Manager_2?: UserShort
}

export interface MaatregelUUID {
    Object_ID?: number
    UUID?: string
}

export interface MaatregelStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface MaatregelPatch {
    Title?: string | null
    Description?: string | null
    Role?: string | null
    Effect?: string | null
    Gebied_UUID?: string | null
}

export interface MaatregelMinimal {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface MaatregelFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type MaatregelFullObjectStatics = MaatregelFullStatics | null

export interface MaatregelFull {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
    Description?: string
    Role?: string
    Effect?: string
    Gebied?: Werkingsgebied
    Created_By?: UserShort
    Modified_By?: UserShort
    Beleidskeuzes?: ReadRelationShortBeleidskeuzeMinimal[]
    Gebiedsprogrammas?: ReadRelationShortGebiedsprogrammaMinimal[]
    Beleidsdoelen?: ReadRelationShortBeleidsdoelMinimal[]
    ObjectStatics?: MaatregelFullObjectStatics
}

export interface MaatregelExtendedStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type MaatregelExtendedObjectStatics = MaatregelExtendedStatics | null

export interface MaatregelExtended {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
    Gebied?: Werkingsgebied
    Created_By?: UserShort
    Modified_By?: UserShort
    ObjectStatics?: MaatregelExtendedObjectStatics
}

export interface MaatregelBasic {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
}

export interface HTTPValidationError {
    detail?: ValidationError[]
}

export interface GraphVertice {
    UUID: string
    Object_Type: string
    Object_ID: number
    Code: string
    Title: string
}

/**
 * An enumeration.
 */
export type GraphEdgeType = typeof GraphEdgeType[keyof typeof GraphEdgeType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GraphEdgeType = {
    relation: 'relation',
    acknowledged_relation: 'acknowledged_relation',
} as const

export interface GraphEdge {
    Vertice_A_Code: string
    Vertice_B_Code: string
    Type: GraphEdgeType
}

export interface GraphResponse {
    Vertices: GraphVertice[]
    Edges: GraphEdge[]
}

export type GeoSearchResultGebied = string | string

export type GeoSearchResultUUID = string | string

export interface GeoSearchResult {
    UUID: GeoSearchResultUUID
    Gebied: GeoSearchResultGebied
    Type: string
    Titel?: string
    Omschrijving?: string
}

export interface GenericObjectShort {
    Object_Type: string
    Object_ID: number
    UUID: string
    Title?: string
    Description?: string
}

export interface GebiedsprogrammaUUID {
    Object_ID?: number
    UUID?: string
}

export interface GebiedsprogrammaStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface GebiedsprogrammaPatch {
    Title?: string | null
    Description?: string | null
    Image?: string | null
}

export interface GebiedsprogrammaMinimal {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface GebiedsprogrammaFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type GebiedsprogrammaFullObjectStatics =
    GebiedsprogrammaFullStatics | null

export interface GebiedsprogrammaFull {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Image?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    Maatregelen?: ReadRelationShortMaatregelMinimal[]
    ObjectStatics?: GebiedsprogrammaFullObjectStatics
}

export interface GebiedsprogrammaExtendedStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type GebiedsprogrammaExtendedObjectStatics =
    GebiedsprogrammaExtendedStatics | null

export interface GebiedsprogrammaExtended {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Image?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    ObjectStatics?: GebiedsprogrammaExtendedObjectStatics
}

export interface GebiedsprogrammaBasic {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Image?: string | null
}

export interface EditAcknowledgedRelation {
    Object_ID: number
    Object_Type: string
    Explanation?: string | null
    Acknowledged?: boolean | null
    Denied?: boolean | null
    Deleted?: boolean | null
}

export interface CompleteModule {
    Default_Start_Validity?: string | null
    IDMS_Link: string
    Decision_Number: string
    Link_To_Decision_Document: string
    ObjectSpecifiekeGeldigheden?: ObjectSpecifiekeGeldigheid[]
}

export interface BodyFastapiHandlerLoginAccessTokenPost {
    grant_type?: string
    username: string
    password: string
    scope?: string
    client_id?: string
    client_secret?: string
}

export interface BeleidsregelUUID {
    Object_ID?: number
    UUID?: string
}

export interface BeleidsregelStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface BeleidsregelPatch {
    Title?: string | null
    Weblink?: string | null
    Description?: string | null
}

export interface BeleidsregelMinimal {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface BeleidsregelFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidsregelFullObjectStatics = BeleidsregelFullStatics | null

export interface BeleidsregelFull {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    Beleidskeuzes?: ReadRelationShortBeleidskeuzeMinimal[]
    ObjectStatics?: BeleidsregelFullObjectStatics
}

export interface BeleidsregelExtendedStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidsregelExtendedObjectStatics =
    BeleidsregelExtendedStatics | null

export interface BeleidsregelExtended {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    ObjectStatics?: BeleidsregelExtendedObjectStatics
}

export interface BeleidsregelBasic {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Start_Validity?: string | null
    End_Validity?: string | null
}

export interface BeleidskeuzeUUID {
    Object_ID?: number
    UUID?: string
}

export interface BeleidskeuzeStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface BeleidskeuzePatch {
    Title?: string | null
    Description?: string | null
    Cause?: string | null
    Provincial_Interest?: string | null
    Explanation?: string | null
    Gebied_UUID?: string | null
}

export interface BeleidskeuzeMinimal {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface BeleidskeuzeFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidskeuzeFullObjectStatics = BeleidskeuzeFullStatics | null

export interface BeleidskeuzeFull {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
    Description?: string
    Cause?: string
    Provincial_Interest?: string
    Explanation?: string
    Gebied?: Werkingsgebied
    Created_By?: UserShort
    Modified_By?: UserShort
    WettelijkeTaken?: ReadRelationShortWettelijkeTaakMinimal[]
    NationaleBelangen?: ReadRelationShortNationaalBelangMinimal[]
    Beleidsdoelen?: ReadRelationShortBeleidsdoelMinimal[]
    Beleidsregels?: ReadRelationShortBeleidsregelMinimal[]
    Maatregelen?: ReadRelationShortMaatregelMinimal[]
    ObjectStatics?: BeleidskeuzeFullObjectStatics
}

export interface BeleidskeuzeExtendedStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidskeuzeExtendedObjectStatics =
    BeleidskeuzeExtendedStatics | null

export interface BeleidskeuzeExtended {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
    Created_By?: UserShort
    Modified_By?: UserShort
    ObjectStatics?: BeleidskeuzeExtendedObjectStatics
}

export interface BeleidskeuzeBasic {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
}

export interface BeleidsdoelUUID {
    Object_ID?: number
    UUID?: string
}

export interface BeleidsdoelStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface BeleidsdoelPatch {
    Title?: string | null
    Description?: string | null
}

export interface BeleidsdoelMinimal {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface BeleidsdoelFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidsdoelFullObjectStatics = BeleidsdoelFullStatics | null

export interface BeleidsdoelFull {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    Ambities?: ReadRelationShortAmbitieMinimal[]
    Beleidskeuzes?: ReadRelationShortBeleidskeuzeMinimal[]
    Maatregelen?: ReadRelationShortMaatregelMinimal[]
    ObjectStatics?: BeleidsdoelFullObjectStatics
}

export interface BeleidsdoelExtendedStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidsdoelExtendedObjectStatics = BeleidsdoelExtendedStatics | null

export interface BeleidsdoelExtended {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    ObjectStatics?: BeleidsdoelExtendedObjectStatics
}

export interface BeleidsdoelBasic {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
}

export interface AuthToken {
    access_token: string
    token_type: string
    identifier: UserShort
}

export interface AmbitieUUID {
    Object_ID?: number
    UUID?: string
}

export interface AmbitieStaticPostStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface AmbitiePatch {
    Title?: string | null
    Description?: string | null
}

export interface AmbitieMinimal {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface AmbitieFullStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type AmbitieFullObjectStatics = AmbitieFullStatics | null

export interface AmbitieFull {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Description?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    Beleidsdoelen?: ReadRelationShortBeleidsdoelMinimal[]
    ObjectStatics?: AmbitieFullObjectStatics
}

export interface AmbitieExtendedStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type AmbitieExtendedObjectStatics = AmbitieExtendedStatics | null

export interface AmbitieExtended {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
    ObjectStatics?: AmbitieExtendedObjectStatics
}

export interface AmbitieBasic {
    Object_ID?: number
    Code?: string
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Start_Validity?: string | null
    End_Validity?: string | null
}

export interface ActiveModuleObject {
    Module_ID?: number
    UUID: string
    Modified_Date: string
    Title: string
}

export interface ActiveModuleObjectWrapper {
    Module: ModuleShort
    Module_Object: ActiveModuleObject
}

export interface AcknowledgedRelationSide {
    Object_ID: number
    Object_Type: string
    Explanation?: string
    Acknowledged?: string
    Acknowledged_By_UUID?: string
    Title?: string
}

export interface AcknowledgedRelation {
    Side_A: AcknowledgedRelationSide
    Side_B: AcknowledgedRelationSide
    Version: number
    Requested_By_Code: string
    Created_Date: string
    Created_By_UUID: string
    Modified_Date: string
    Modified_By_UUID: string
    Denied?: string
    Deleted_At?: string
}
