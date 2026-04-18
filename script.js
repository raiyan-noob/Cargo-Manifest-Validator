const cargo= {
  containerId: 68,
  destination: "Salinas",
  weight: 101,
  unit: "lb",
  hazmat: true
}
function normalizeUnits(manifest)
{
const newManifest = {
    containerId: manifest.containerId,
    destination: manifest.destination,
    weight: manifest.weight,
    unit: manifest.unit,
    hazmat: manifest.hazmat
  };

  if (newManifest.unit == "lb") {
    newManifest.weight = newManifest.weight * 0.45;
    newManifest.unit = "kg";
  }

  return newManifest;
}

function validateManifest(manifest)
{
  const errors = {};

  if (!("containerId" in manifest)) {
    errors.containerId = "Missing";
  } else if (!Number.isInteger(manifest.containerId) || manifest.containerId <= 0) {
    errors.containerId = "Invalid";
  }


  if (!("destination" in manifest)) {
    errors.destination = "Missing";
  } else if (typeof manifest.destination !== "string" || manifest.destination.trim() === "") {
    errors.destination = "Invalid";
  }


  if (!("weight" in manifest)) {
    errors.weight = "Missing";
  } else if (typeof manifest.weight !== "number" || Number.isNaN(manifest.weight) || manifest.weight <= 0) {
    errors.weight = "Invalid";
  }

  if (!("unit" in manifest)) {
    errors.unit = "Missing";
  } else if (manifest.unit !== "kg" && manifest.unit !== "lb") {
    errors.unit = "Invalid";
  }

  if (!("hazmat" in manifest)) {
    errors.hazmat = "Missing";
  } else if (typeof manifest.hazmat !== "boolean") {
    errors.hazmat = "Invalid";
  }

  return errors;

}
function processManifest(manifest)
{
  const check= validateManifest(manifest);
  const amount=normalizeUnits(manifest);
  if(Object.keys(check).length === 0 && amount.weight<=200)
  {
    console.log("Validation success: "+manifest.containerId);
    console.log("Total weight: "+amount.weight+ " kg");
  }
  else
  {
    console.log("Validation error: "+manifest.containerId);
    console.log(check);
  }


}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('manifestForm');
    const resultContainer = document.getElementById('resultContainer');
    const emptyState = document.getElementById('emptyState');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const manifest = {
            containerId: parseInt(document.getElementById('containerId').value),
            destination: document.getElementById('destination').value,
            weight: parseFloat(document.getElementById('weight').value),
            unit: document.getElementById('unit').value,
            hazmat: document.getElementById('hazmat').checked
        };


        const errors = validateManifest(manifest);
        const normalizedManifest = normalizeUnits(manifest);

       
        displayResults(manifest, normalizedManifest, errors);
    });

    function displayResults(original, normalized, errors) {
        emptyState.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        if (normalized.weight > 200) {
            errors.weight = "Weight must be under 200 kg";
        }

        const isValid = Object.keys(errors).length === 0;

        const statusBox = document.getElementById('statusBox');
        if (isValid) {
            statusBox.textContent = `✓ Validation Successful - Container ${original.containerId}`;
            statusBox.className = 'status-box success';
        } else {
            statusBox.textContent = `✗ Validation Failed - Container ${original.containerId}`;
            statusBox.className = 'status-box error';
        }

        // Display manifest details
        displayManifestDetails(original, normalized, isValid);

        // Display errors if any
        displayErrors(errors, isValid);

        // Display success message
        const successMessage = document.getElementById('successMessage');
        if (isValid) {
            successMessage.classList.remove('hidden');
        } else {
            successMessage.classList.add('hidden');
        }
    }

    function displayManifestDetails(original, normalized, isValid) {
        const detailsDiv = document.getElementById('manifestDetails');
        
        let html = '';
        html += `<div class="detail-row">
                    <strong>Container ID:</strong>
                    <span>${original.containerId}</span>
                </div>`;
        html += `<div class="detail-row">
                    <strong>Destination:</strong>
                    <span>${original.destination}</span>
                </div>`;
        html += `<div class="detail-row">
                    <strong>Weight (Original):</strong>
                    <span>${original.weight} ${original.unit}</span>
                </div>`;
        html += `<div class="detail-row">
                    <strong>Weight (Normalized):</strong>
                    <span>${normalized.weight.toFixed(2)} ${normalized.unit}</span>
                </div>`;
        html += `<div class="detail-row">
                    <strong>Hazmat Status:</strong>
                    <span>${original.hazmat ? '⚠️ Yes - Hazardous Material' : '✓ No - Non-Hazardous'}</span>
                </div>`;

        detailsDiv.innerHTML = html;
        detailsDiv.classList.remove('hidden');
    }

    function displayErrors(errors, isValid) {
        const errorsDiv = document.getElementById('errorsDisplay');
        
        if (isValid) {
            errorsDiv.classList.add('hidden');
        } else {
            let html = '<h4>Validation Errors Found:</h4><ul class="error-list">';
            
            for (const [field, error] of Object.entries(errors)) {
                const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
                html += `<li class="error-item">
                            <strong>${fieldLabel}:</strong>
                            <span>${error}</span>
                        </li>`;
            }
            
            html += '</ul>';
            errorsDiv.innerHTML = html;
            errorsDiv.classList.remove('hidden');
        }
    }
});


processManifest(cargo);