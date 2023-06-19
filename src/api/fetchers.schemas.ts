/**
 * Generated by orval v6.12.1 🍺
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

export type ModulesGetParams = {
    only_mine?: boolean
    only_active?: boolean
    object_type?: string
    lineage_id?: number
}

export type ObjectGraphGetParams = {
    uuid: string
}

export type SearchGetParams = {
    query: string
    offset?: number
    limit?: number
}

export type WettelijkeTaakValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type VerplichtProgrammaValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type NationaalBelangValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type ModulesModuleIdObjectMaatregelLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type MaatregelenValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type MaatregelenValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type ModulesModuleIdObjectGebiedsprogrammasLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type GebiedsprogrammasValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type GebiedsprogrammasValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type ModulesModuleIdObjectBeleidsregelLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type BeleidsregelsValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type BeleidsregelsValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type ModulesModuleIdObjectBeleidskeuzeLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
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
}

export type BeleidskeuzesValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type ModulesModuleIdObjectBeleidsdoelLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type BeleidsdoelenValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type BeleidsdoelenValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type ModulesModuleIdObjectAmbitieLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type AmbitiesValidLineageIdGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export type AmbitiesValidGetParams = {
    all_filters?: string
    any_filters?: string
    offset?: number
    limit?: number
}

export interface WettelijkeTaakUUID {
    Object_ID?: number
    UUID?: string
}

export interface WettelijkeTaakStaticEditStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export interface WettelijkeTaakShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
}

export interface WettelijkeTaakGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
}

export type WettelijkeTaakGetObjectStatics = WettelijkeTaakGetStatics | null

export interface WettelijkeTaakGet {
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
    WettelijkeTaken?: WettelijkeTaakShort[]
    Beleidskeuzes?: RelationShortBeleidskeuzeShort[]
    ObjectStatics?: WettelijkeTaakGetObjectStatics
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
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Created_By?: UserShort
    Modified_By?: UserShort
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

export interface VerplichtProgrammaStaticEditStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export interface VerplichtProgrammaGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
}

export type VerplichtProgrammaGetObjectStatics =
    VerplichtProgrammaGetStatics | null

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
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Created_By?: UserShort
    Modified_By?: UserShort
}

export type ValidationErrorLocItem = string | number

export interface ValidationError {
    loc: ValidationErrorLocItem[]
    msg: string
    type: string
}

export interface UserShort {
    UUID: string
    Rol: string
    Gebruikersnaam: string
}

export interface VerplichtProgrammaGet {
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
    WettelijkeTaken?: WettelijkeTaakShort[]
    Maatregelen?: RelationShortMaatregelShort[]
    ObjectStatics?: VerplichtProgrammaGetObjectStatics
}

export interface SearchObject {
    Object_Type: string
    Object_ID: number
    UUID: string
    Title: string
    Description: string
}

export interface SearchResponse {
    Objects: SearchObject[]
}

export interface ResponseOK {
    message: string
}

export interface RequestAcknowledgedRelation {
    Object_ID: number
    Object_Type: string
    Explanation?: string
}

export interface RelationShort {
    Object_ID: number
    Object_Type: string
    Description?: string
}

export interface RelationShortWettelijkeTaakShort {
    Relation: RelationShort
    Object: WettelijkeTaakShort
}

export interface RelationShortNationaalBelangShort {
    Relation: RelationShort
    Object: NationaalBelangShort
}

export interface RelationShortMaatregelShort {
    Relation: RelationShort
    Object: MaatregelShort
}

export interface RelationShortGebiedsprogrammaShort {
    Relation: RelationShort
    Object: GebiedsprogrammaShort
}

export interface RelationShortBeleidsregelShort {
    Relation: RelationShort
    Object: BeleidsregelShort
}

export interface RelationShortBeleidskeuzeShort {
    Relation: RelationShort
    Object: BeleidskeuzeShort
}

export interface RelationShortBeleidsdoelShort {
    Relation: RelationShort
    Object: BeleidsdoelShort
}

export interface RelationShortAmbitieShort {
    Relation: RelationShort
    Object: AmbitieShort
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

export interface NationaalBelangStaticEditStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
}

export interface NationaalBelangShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
}

export interface NationaalBelangGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
}

export type NationaalBelangGetObjectStatics = NationaalBelangGetStatics | null

export interface NationaalBelangGet {
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
    Beleidskeuzes?: BeleidskeuzeShort[]
    ObjectStatics?: NationaalBelangGetObjectStatics
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
    UUID?: string
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Weblink?: string
    Created_By?: UserShort
    Modified_By?: UserShort
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

export interface ModulePatchStatus {
    Status: ModuleStatusCode
}

export interface ModuleObjectContextShort {
    Action: string
    Original_Adjust_On?: string
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

export interface MaatregelStaticPatchStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface MaatregelShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface MaatregelPatch {
    Title?: string | null
    Description?: string | null
    Role?: string | null
    Effect?: string | null
    Gebied_UUID?: string | null
}

export interface MaatregelGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type MaatregelGetObjectStatics = MaatregelGetStatics | null

export interface MaatregelGet {
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
    Beleidskeuzes?: RelationShortBeleidskeuzeShort[]
    Gebiedsprogrammas?: RelationShortGebiedsprogrammaShort[]
    Beleidsdoelen?: RelationShortBeleidsdoelShort[]
    ObjectStatics?: MaatregelGetObjectStatics
}

export interface MaatregelBasic {
    Object_ID?: number
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Title?: string
    Role?: string
    Gebied?: Werkingsgebied
    Created_By?: UserShort
    Modified_By?: UserShort
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

export interface GebiedsprogrammaShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface GebiedsprogrammaPatch {
    Title?: string | null
    Description?: string | null
    Image?: string | null
}

export interface GebiedsprogrammaGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type GebiedsprogrammaGetObjectStatics = GebiedsprogrammaGetStatics | null

export interface GebiedsprogrammaGet {
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
    Maatregelen?: RelationShortMaatregelShort[]
    ObjectStatics?: GebiedsprogrammaGetObjectStatics
}

export interface GebiedsprogrammaBasic {
    Object_ID?: number
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
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

export interface BeleidsregelShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface BeleidsregelPatch {
    Title?: string | null
    Weblink?: string | null
    Description?: string | null
}

export interface BeleidsregelGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidsregelGetObjectStatics = BeleidsregelGetStatics | null

export interface BeleidsregelGet {
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
    Beleidskeuzes?: RelationShortBeleidskeuzeShort[]
    ObjectStatics?: BeleidsregelGetObjectStatics
}

export interface BeleidsregelBasic {
    Object_ID?: number
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
}

export interface BeleidskeuzeUUID {
    Object_ID?: number
    UUID?: string
}

export interface BeleidskeuzeStaticPatchStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface BeleidskeuzeShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface BeleidskeuzePatch {
    Title?: string | null
    Description?: string | null
    Cause?: string | null
    Provincial_Interest?: string | null
    Explanation?: string | null
    Gebied_UUID?: string | null
}

export interface BeleidskeuzeGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidskeuzeGetObjectStatics = BeleidskeuzeGetStatics | null

export interface BeleidskeuzeGet {
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
    WettelijkeTaken?: RelationShortWettelijkeTaakShort[]
    NationaleBelangen?: RelationShortNationaalBelangShort[]
    Beleidsdoelen?: RelationShortBeleidsdoelShort[]
    Beleidsregels?: RelationShortBeleidsregelShort[]
    Maatregelen?: RelationShortMaatregelShort[]
    ObjectStatics?: BeleidskeuzeGetObjectStatics
}

export interface BeleidskeuzeBasic {
    Object_ID?: number
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
}

export interface BeleidsdoelUUID {
    Object_ID?: number
    UUID?: string
}

export interface BeleidsdoelStaticPatchStatics {
    Owner_1_UUID?: string | null
    Owner_2_UUID?: string | null
    Portfolio_Holder_1_UUID?: string | null
    Portfolio_Holder_2_UUID?: string | null
    Client_1_UUID?: string | null
}

export interface BeleidsdoelShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface BeleidsdoelPatch {
    Title?: string | null
    Description?: string | null
}

export interface BeleidsdoelGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type BeleidsdoelGetObjectStatics = BeleidsdoelGetStatics | null

export interface BeleidsdoelGet {
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
    Ambities?: RelationShortAmbitieShort[]
    Beleidskeuzes?: RelationShortBeleidskeuzeShort[]
    Maatregelen?: RelationShortMaatregelShort[]
    ObjectStatics?: BeleidsdoelGetObjectStatics
}

export interface BeleidsdoelBasic {
    Object_ID?: number
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

export interface AmbitieShort {
    Object_Type?: string
    Object_ID?: number
    UUID?: string
    Title?: string
}

export interface AmbitiePatch {
    Title?: string | null
    Description?: string | null
}

export interface AmbitieGetStatics {
    Owner_1?: UserShort
    Owner_2?: UserShort
    Portfolio_Holder_1?: UserShort
    Portfolio_Holder_2?: UserShort
    Client_1?: UserShort
}

export type AmbitieGetObjectStatics = AmbitieGetStatics | null

export interface AmbitieGet {
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
    Beleidsdoelen?: RelationShortBeleidsdoelShort[]
    ObjectStatics?: AmbitieGetObjectStatics
}

export interface AmbitieBasic {
    Object_ID?: number
    UUID?: string
    Adjust_On?: string | null
    Created_Date?: string
    Modified_Date?: string
    Title?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Created_By?: UserShort
    Modified_By?: UserShort
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
