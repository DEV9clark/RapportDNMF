const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/generate-pdf', (req, res) => {
    const formData = req.body;
    const month = formData.month;
    const year = formData.year;
    const country = formData.pays;

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Rapport Mensuel</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20mm; }
                h1, h2, h3 { color: #333; text-align: center; margin-bottom: 15px; }
                .section { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9; }
                p { margin-bottom: 8px; }
                strong { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Rapport du mois de ${month} ${year}</h1>
            <div class="section">
                <h2>Division Mission</h2>
                <h3>Service de l’Expansion de l’Évangile</h3>
                <p><strong>Pays :</strong> ${country}</p>
                <p><strong>Nombre de districts :</strong> ${formData.districts}</p>
                <p><strong>Nombre d'assemblées :</strong> ${formData.assemblees}</p>
                <p><strong>Nombre de cellules :</strong> ${formData.cellules}</p>
                <p><strong>Nombre de nouvelles zones :</strong> ${formData.nouvellesZones}</p>
                <p><strong>Nombre de membres :</strong> ${formData.membres}</p>

                <h3>Séminaires</h3>
                <p><strong>Nombre de séminaires en assemblée :</strong> ${formData.seminairesAssemblee}</p>
                <p><strong>Nombre de séminaires hors assemblée :</strong> ${formData.seminairesHorsAssemblee}</p>
                <p><strong>Assistance :</strong> ${formData.assistance}</p>
                <p><strong>Invités :</strong> ${formData.invites}</p>
                <p><strong>Sauvés :</strong> ${formData.sauves}</p>
                <p><strong>Témoignages :</strong> ${formData.temoignages}</p>
                <p><strong>Ajoutés :</strong> ${formData.ajoutes}</p>
                <p><strong>Nombre de prédicateurs :</strong> ${formData.predicateursMission}</p>
                <p><strong>Dépense :</strong> ${formData.depense}</p>
                <p><strong>Notes :</strong> ${formData.notes}</p>
            </div>

            <div class="section">
                <h3>Service de Programmation du Fichier Mission</h3>
                <p><strong>Intervenants aux séminaires :</strong> ${formData.intervenantsSeminaires}</p>
                <p><strong>Nombre de missions nationales :</strong> ${formData.missionsNationales}</p>
                <p><strong>Nombre de missions internationales :</strong> ${formData.missionsInternationales}</p>
                <p><strong>Nombre de prédicateurs :</strong> ${formData.predicateursProg}</p>
                <p><strong>Nombre de pasteurs :</strong> ${formData.pasteursProg}</p>
                <p><strong>Missionnaires internationaux :</strong> ${formData.missionnairesInternationaux}</p>
                <p><strong>Missionnaires nationaux :</strong> ${formData.missionnairesNationaux}</p>
            </div>

            <div class="section">
                <h3>Service de Suivi Spirituel</h3>
                <p><strong>Nombre de pasteurs et de prédicateurs ayant un problème doctrinal :</strong> ${formData.pasteursProblemeDoctrinal}</p>
                <p><strong>Nombre de frères ayant un problème doctrinal :</strong> ${formData.freresProblemeDoctrinal}</p>
                <p><strong>Problèmes doctrinaux soulevés :</strong> ${formData.problemesDoctrinauxSouleves}</p>
                <p><strong>Approches de solutions :</strong> ${formData.approchesSolutions}</p>
                <p><strong>Décisions finales :</strong> ${formData.decisionsFinales}</p>
            </div>

            <div class="section">
                <h2>Division Formation</h2>
                <h3>Service de Formation Académique</h3>
                <p><strong>Nombre d'écoles ouvertes :</strong> ${formData.ecolesOuvertes}</p>
                <p><strong>Nombre d’élèves prédicateurs inscrits :</strong> ${formData.elevesInscrits}</p>
                <p><strong>Nombre d’élèves prédicateurs actuels :</strong> ${formData.elevesActuels}</p>
                <p><strong>Nombre de formateurs d’école :</strong> ${formData.formateursEcole}</p>
                <p><strong>Nombre de modules donnés :</strong> ${formData.modulesDonnes}</p>
            </div>

            <div class="section">
                <h3>Service de Formation Classique</h3>
                <p><strong>Nombre de formations classiques :</strong> ${formData.formationsClassiques}</p>
                <p><strong>Nombre de sauvés formés :</strong> ${formData.sauvesFormes}</p>
                <p><strong>Nombre de formateurs nationaux utilisés :</strong> ${formData.formateursNationaux}</p>
                <p><strong>Nombre de formateurs internationaux utilisés :</strong> ${formData.formateursInternationaux}</p>
            </div>

            <div class="section">
                <h3>Service de Formations Diverses</h3>
                <p><strong>Nombre de formations diverses dispensées :</strong> ${formData.formationsDiverses}</p>
            </div>

            <div class="section">
                <h3>Renforcement des Capacités des Leaders</h3>
                <p><strong>Nombre de renforcements de capacités des leaders :</strong> ${formData.renforcementsLeaders}</p>
                <p><strong>Nombre de leaders renforcés :</strong> ${formData.leadersRenforces}</p>
            </div>

            <div class="section">
                <h3>Autres</h3>
                <p><strong>Nombre d'hommes formés :</strong> ${formData.hommesFormes}</p>
                <p><strong>Nombre de femmes formées :</strong> ${formData.femmesFormees}</p>
                <p><strong>Nombre de jeunes formés :</strong> ${formData.jeunesFormes}</p>
            </div>
        </body>
        </html>
    `;

    const pdfFileName = `Rapport_Mensuel_${month}_${year}_${country}.pdf`;
    const pdfPath = path.join(__dirname, 'temp', pdfFileName);

    // Ensure the temp directory exists
    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
        fs.mkdirSync(path.join(__dirname, 'temp'));
    }

    pdf.create(htmlContent, { format: 'A4' }).toFile(pdfPath, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors de la génération du PDF.');
        }
        console.log(`PDF généré: ${result.filename}`);

        // For now, we'll just send the PDF back as a download.
        // Integration with WhatsApp/Telegram would go here.
        res.download(pdfPath, pdfFileName, (downloadErr) => {
            if (downloadErr) {
                console.error('Erreur lors du téléchargement du PDF:', downloadErr);
                // If there's an error sending, still try to delete the temp file
            }
            // Clean up the temporary file
            fs.unlink(pdfPath, (unlinkErr) => {
                if (unlinkErr) console.error('Erreur lors de la suppression du fichier temporaire:', unlinkErr);
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
