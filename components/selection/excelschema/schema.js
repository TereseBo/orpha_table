export const headerStyle = {
    backgroundColor: '#039ca1',
    fontWeight: 'bold',
    fontSize: 12,
    align: 'center',
    borderColor: '#ffffff',
    borderStyle: 'thick'
}


export const schema = [
    {
        column: 'ORPHA',
        type: Number,
        value: disease => disease.orphacode,

        //Cell styling
        width: 10,
        fontSize: 12,
        alignVertical: 'center',
        align: 'center',

    },
    {
        column: 'ICD-10',
        type: String,
        value: disease => disease.referencesICD10.toString(),

        //Cell styling
        width: 10,
        fontSize: 8,
        height: 26,
        alignVertical: 'center',
        wrap: true
    },
    {
        column: 'Prefered name',
        type: String,
        value: disease => disease.preferredTerm,

        //Cell styling
        width: 20,
        fontSize: 12,
        alignVertical: 'center',
    },
    {
        column: 'Synonyms',
        type: 'Formula',
        value: (disease) => {
            let synonyms = JSON.stringify(disease.synonyms.map(x => x));
            synonyms = synonyms.replace("[", '').replace("]", '').replace(/"/g, '').replace(/,/g, ',\n');
            synonyms = `"${synonyms}"`

            return `=SUBSTITUTE(${synonyms.toString()}, "\n", CHAR(10))`
        },

        //Cell styling
        width: 20,
        fontSize: 8,
        height: 26,
        alignVertical: 'center',
        wrap: true
    },
    {
        column: 'Disorder level',
        type: String,
        value: disease => disease.classificationLevel,

        //Cell styling
        width: 15,
        fontSize: 12,
        alignVertical: 'center',
    }
]