document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const rephraseBtn = document.getElementById('rephraseBtn');
    const btnText = rephraseBtn.querySelector('.btn-text');
    const loadingSpinner = rephraseBtn.querySelector('.loading-spinner');
    const outputSection = document.getElementById('outputSection');
    const outputContent = document.getElementById('outputContent');
    const copyBtn = document.getElementById('copyBtn');

    rephraseBtn.addEventListener('click', async () => {
        const text = promptInput.value.trim();

        if (!text) {
            alert('Please enter a prompt to rephrase.');
            return;
        }

        // Show loading state
        setLoading(true);
        outputSection.classList.add('hidden');

        try {
            // Using corsproxy.io to bypass CORS restrictions for the static app
            const response = await fetch('https://corsproxy.io/?https://promptperfect.xyz/rephrase_extension', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    userId: "",
                    stripeCustomerId: ""
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch rephrased text');
            }

            const data = await response.json();

            if (data.text) {
                outputContent.textContent = data.text;
                outputSection.classList.remove('hidden');
                // Scroll to output
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else if (data.rephrased && data.rephrased.text) {
                outputContent.textContent = data.rephrased.text;
                outputSection.classList.remove('hidden');
                // Scroll to output
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error(error);
            alert('An error occurred while rephrasing. Please try again.');
        } finally {
            setLoading(false);
        }
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = outputContent.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Copied!</span>
            `;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    function setLoading(isLoading) {
        if (isLoading) {
            rephraseBtn.disabled = true;
            btnText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            rephraseBtn.disabled = false;
            btnText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }
});
