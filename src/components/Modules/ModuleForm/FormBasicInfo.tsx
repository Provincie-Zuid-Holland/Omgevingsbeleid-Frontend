import {
    FormikInput,
    FormikRte,
    FormikSelect,
    getHeadingStyles,
    Text,
} from '@pzh-ui/components'
import { useMedia } from 'react-use'

const FormBasicInfo = () => {
    const isMobile = useMedia('(max-width: 640px)')

    return (
        <>
            <div className="col-span-2">
                <h2 style={getHeadingStyles('3', isMobile)} className="mb-3">
                    Algemene informatie
                </h2>
                <Text type="body">
                    De algemene informatie bevat een duidelijke titel en
                    moduletrekkers.
                </Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <FormikInput
                    name="Titel"
                    label="Titel"
                    placeholder="Titel van de module"
                    required
                />
                <div className="mt-6 grid grid-cols-2 gap-x-10">
                    <div>
                        <FormikSelect
                            name="Moduletrekker1"
                            label="Moduletrekker 1"
                            placeholder="Selecteer een moduletrekker"
                            options={[
                                {
                                    label: 'Erik Verhaar',
                                    value: 1,
                                },
                                {
                                    label: 'Tom van Gelder',
                                    value: 2,
                                },
                            ]}
                            required
                        />
                    </div>
                    <div>
                        <FormikSelect
                            name="Moduletrekker2"
                            label="Moduletrekker 2"
                            placeholder="Selecteer een moduletrekker"
                            options={[
                                {
                                    label: 'Erik Verhaar',
                                    value: 1,
                                },
                                {
                                    label: 'Tom van Gelder',
                                    value: 2,
                                },
                            ]}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <FormikRte
                        name="Omschrijving"
                        label="Omschrijving"
                        description="Geef een omschrijving van de module. Denk hierbij aan de aanpassingen die worden gedaan."
                        required
                    />
                </div>
            </div>
        </>
    )
}

export default FormBasicInfo
