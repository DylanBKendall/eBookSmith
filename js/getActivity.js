$(document).ready(function () {
    $.get('api/getActivity.php', function (data) {
        if (!Array.isArray(data)) {
            console.error('Invalid data from server:', data);
            return;
        }

        const table = $('#activity-table').DataTable({
            data: data,
            columns: [
                { data: 'title', defaultContent: '(Untitled)' },
                { data: 'author', defaultContent: '(Unknown)' },
                { data: 'endpoint' },
                { data: 'called_at' }
            ],
            paging: true,
            info: false
        });

        $('#activity-table tbody').on('click', 'tr', function () {
            const tr = $(this);
            const row = table.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                const rowData = row.data();
                const endpoint = rowData.endpoint;

                let payload = {};
                let metadata = {};

                try {
                    payload = JSON.parse(rowData.request_payload || '{}');
                    metadata = JSON.parse(rowData.response_metadata || '{}');
                } catch (e) {
                    console.warn('Invalid JSON in request/response payload:', e);
                }

                let childHtml = '';

                if (endpoint === 'generateContent') {
                    const prompt = payload.prompt || '(No prompt)';
                    const contentPreview = (metadata.content || '').substring(0, 300);

                    childHtml = `
                            <div class="transaction-details">
                                <strong>Prompt:</strong>
                                <pre>${prompt}</pre>
                                <strong>Content Preview:</strong>
                                <pre>${contentPreview || '(No content)'}</pre>
                            </div>
                            `;
                } else if (endpoint === 'generateEBook') {
                    const file = metadata.file;
                    if (file) {
                        childHtml = `
                            <div class="transaction-details">
                                <strong>Download:</strong>
                                <a class="btn btn-sm btn-outline-warning" href="ebooks/${file}" target="_blank">${file}</a>
                            </div>
                            `;
                    } else {
                        childHtml = '<div style="padding: 1rem; color: gray;">No download available.</div>';
                    }
                } else {
                    childHtml = '<div style="padding: 1rem; color: gray;">No additional details available.</div>';
                }
                row.child(childHtml).show();
                tr.addClass('shown');
            }
        });
    }).fail(function (err) {
        console.error('Failed to load activity:', err);
    });
});
