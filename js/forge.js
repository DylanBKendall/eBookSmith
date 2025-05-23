$(document).ready(function () {
    $.ajax({
        url: 'assets/exampleStory.txt',
        method: 'GET'
    })
        .done(function (data) {
            $('#content').attr('placeholder', data)
        })
        .fail(function () {
            $('#content').attr('placeholder', 'Failed to load sample text.')
        })
})

$('#generateContent').click(function () {
    let prompt = $('#prompt').val().trim()

    if (!prompt) {
        $('#prompt').addClass('is-invalid')
        return
    }
    $('#prompt').removeClass('is-invalid')

    $('#loading-content').show()
    $(this).prop('disabled', true)

    $.ajax({
        url: 'api/generateContent.php',
        method: 'POST',
        data: { prompt: prompt },
        dataType: 'json'
    })
        .done(function (data) {
            let content = data.content?.trim() || ''
            $('#content').val(content)
            if (!content) return

            $.ajax({
                url: 'api/generateTitle.php',
                method: 'POST',
                data: { content: content },
                dataType: 'json'
            })
                .done(function (data) {
                    $('#title').val(data.title)
                })
                .fail(function () {
                    alert('Failed to generate title.')
                })
        })
        .fail(function () {
            alert('Failed to generate content.')
        })
        .always(() => {
            $('#loading-content').hide()
            $('#generateContent').prop('disabled', false)
        })
})

$('#generateEBook').click(function () {
    let title = $('#title').val().trim()
    let content = $('#content').val().trim()
    let author = $('#author').val().trim()
    let cover = $('#cover')[0].files[0]

    !title
        ? $('#title').addClass('is-invalid')
        : $('#title').removeClass('is-invalid')
    !content
        ? $('#content').addClass('is-invalid')
        : $('#content').removeClass('is-invalid')
    !author
        ? $('#author').addClass('is-invalid')
        : $('#author').removeClass('is-invalid')
    if (!title || !content || !author) return

    let bookData = new FormData()
    bookData.append('title', title)
    bookData.append('content', content)
    bookData.append('author', author)

    if (cover) bookData.append('cover', cover)

    $.ajax({
        url: 'api/generateEBook.php',
        method: 'POST',
        data: bookData,
        contentType: false,
        processData: false,
        dataType: 'json'
    })
        .done(function (data) {
            if (data.downloadUrl) {
                $('#status').html(`<a href="${data.downloadUrl}" download>Download your eBook</a>`)
            } else {
                $('#status').html(`Failed to generate eBook: ${data.error || 'Unknown error'}`)
            }
        })
        .fail(function () {
            alert('Failed to generate eBook.')
        })
})
