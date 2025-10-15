document.getElementById('generatePdf').addEventListener('click', async function() {
    const formData = {};
    document.querySelectorAll('#reportForm input, #reportForm textarea, #reportForm select').forEach(field => {
        formData[field.id] = field.value;
    });

    try {
        const response = await fetch('http://localhost:3000/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Rapport_Mensuel_${formData.month}_${formData.year}_${formData.pays}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('PDF généré et téléchargé avec succès !');
        } else {
            const errorText = await response.text();
            alert(`Erreur lors de la génération du PDF: ${errorText}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la communication avec le serveur.');
    }
});
