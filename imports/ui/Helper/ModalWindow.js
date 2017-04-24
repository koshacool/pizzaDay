export const ShowWindow = function (content) {
        var modalDiv = document.createElement('div');
        modalDiv.id = 'modalDiv';
        content.id = 'modalForm';
        modalDiv.appendChild(content);
        document.body.appendChild(modalDiv);
};

export const HideWindow = function hideCover() {
    document.body.removeChild(document.getElementById('modalDiv'));
}