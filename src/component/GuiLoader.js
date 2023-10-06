
import { Skeleton } from '@mui/material';

function GuiLoader({ rowsNum }) {
    const loadingRows = Array.from({ length: rowsNum }, (_, index) => (
      <tr key={index}>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
      </tr>
    ));
  
    return <>{loadingRows}</>;
  }
  export default GuiLoader;