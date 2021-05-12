export default function readJsonFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, 'utf-8');
        reader.onload = (e) => {
            resolve(JSON.parse(e.target.result));
        };
        reader.onerror = (e) => {
            reject(new Error(`Unable to read data file. Error: ${e.message}`));
        };
    });
}
