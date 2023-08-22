$(document).ready(function() {

    // Importa la biblioteca
    const XLSX = window.XLSX;
    
    document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            const jsonStr = JSON.stringify(jsonData);
            const encodedData = encodeURIComponent(jsonStr);

            window.location.href = `home.html?data=${encodedData}`;
        };

        reader.readAsArrayBuffer(file);
    }
});