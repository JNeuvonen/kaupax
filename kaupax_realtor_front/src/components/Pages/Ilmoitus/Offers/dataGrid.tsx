import { WHITE_TEXT } from "@/utils/constants";
import {
  convertFormattedDateToTimeElapsed,
  convertFormattedPriceToNumber,
  formatPrices,
  getTimeElapsed,
} from "@/utils/functions";
import { Apartment } from "@/utils/types/apartment";
import { Realtor } from "@/utils/types/realtor";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "updatedAt",
    headerName: "Ajanhetki",
    type: "string",
    width: 200,

    sortComparator: (v1, v2) => {
      return (
        convertFormattedDateToTimeElapsed(v1) -
        convertFormattedDateToTimeElapsed(v2)
      );
    },
    valueGetter: (params) => {
      return getTimeElapsed(new Date(params.value));
    },
  },
  {
    field: "none",
    headerName: "Yhteensä",
    width: 200,
    type: "number",
    sortComparator: (v1, v2) => {
      return (
        convertFormattedPriceToNumber(v1) - convertFormattedPriceToNumber(v2)
      );
    },
    valueGetter: (params) => {
      return formatPrices(params.row.price - params.row.comission);
    },
  },
  {
    field: "price",
    headerName: "Pyyntihinta",
    width: 200,
    type: "number",
    sortComparator: (v1, v2) => {
      return (
        convertFormattedPriceToNumber(v1) - convertFormattedPriceToNumber(v2)
      );
    },
    valueGetter: (params) => {
      return formatPrices(params.row.price);
    },
  },
  {
    field: "comission",
    headerName: "Välityspalkkio",
    width: 200,
    type: "number",
    sortComparator: (_v1, _v2, v1Params, v2Params) => {
      return (
        Number(v1Params.value.replace(" €", "")) -
        Number(v2Params.value.replace(" €", ""))
      );
    },
    valueGetter: (params) => {
      return formatPrices(params.value) + " €";
    },
  },
];

export default function DataGridWrapper({
  realtor,
  apartment,
}: {
  realtor: Realtor;
  apartment: Apartment;
}) {
  if (apartment.Bid.length === 0) return null;

  function getRowClassName(params: any) {
    return params.row.realtorId === realtor.id ? "highlighted-row" : "";
  }

  return (
    <Box sx={{ marginTop: "32px" }}>
      <Box>
        <Typography variant={"h6"} color={WHITE_TEXT({ alpha: "0.9" })}>
          Kaikki tarjoukset
        </Typography>
      </Box>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          getRowClassName={getRowClassName}
          sx={{
            border: "none",
            color: WHITE_TEXT({ alpha: "0.9" }),
            ".highlighted-row": {
              background: "#35373D",
            },

            ".MuiDataGrid-sortIcon": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiDataGrid-footerCell": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiDataGrid-rowCount": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiDataGrid-row": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiDataGrid-actionsCell": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiDataGrid-footerContainer": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiTablePagination-displayedRows": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiSvgIcon-root": {
              color: WHITE_TEXT({ alpha: "0.7" }),
            },
            ".MuiDataGrid-cell": {
              borderColor: "black",
            },
            ".MuiDataGrid-withBorderColor": {
              borderColor: "black",
            },
          }}
          rows={apartment.Bid}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
