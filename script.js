document.getElementById('generatePdf').addEventListener('click', function() {
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const country = document.getElementById('pays').value;

    const element = document.getElementById('reportForm');

    // Clone the form to manipulate its content for PDF generation
    const clonedElement = element.cloneNode(true);

    // Remove the button from the cloned element before generating PDF
    const button = clonedElement.querySelector('#generatePdf');
    if (button) {
        button.remove();
    }

    // Add the report title with selected month, year, and country
    const h1 = clonedElement.querySelector('h1');
    h1.textContent = `Rapport du mois de ${month} ${year}`;

    // Replace input fields and select elements with their values for display in PDF
    clonedElement.querySelectorAll('input, textarea, select').forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);
        const p = document.createElement('p');
        let valueToDisplay = field.value;

        if (field.tagName === 'SELECT') {
            const selectedOption = field.options[field.selectedIndex];
            valueToDisplay = selectedOption ? selectedOption.textContent : field.value;
        }

        p.innerHTML = `<strong>${label ? label.textContent : field.id}:</strong> ${valueToDisplay}`;
        field.parentNode.replaceChild(p, field);
    });

    const options = {
        margin: 10,
        filename: `Rapport_Mensuel_${month}_${year}_${country}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(clonedElement).set(options).save();
});
