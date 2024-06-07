export function Options() {
    return (
        <div className="flex flex-row">
            <div className="flex flex-col mx-8">
                <label for="ORPHAcode">ORPHAcode</label>
                <input type="radio" name="options" value="ORPHAcode" id="ORPHAcode" />
            </div>
            <div className="flex flex-col mx-8">
                <label for="ICD-10">ICD-10</label>
                <input type="radio" name="options" value="ICD-10" id="ICD-10" />
            </div>
            <div className="flex flex-col mx-8">
                <label for="name">name</label>
                <input type="radio" name="options" value="name" id="name" />
            </div>
            
        </div>
    );
}