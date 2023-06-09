class table{
    constructor(){
        this.table = new DataTable('#myTable');

        $(document).ready(function () {
            $('#table_id').DataTable({
                "scrollY": "10",
                "scrollCollapse": true,
                "dom": "<'table-responsive'tr>"
            });
        });
    }

}