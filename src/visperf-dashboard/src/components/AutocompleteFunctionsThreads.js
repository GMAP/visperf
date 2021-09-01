import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//     container: {
//         paddingLeft: theme.spacing(2),
//         paddingRight: theme.spacing(2),
//         paddingTop: theme.spacing(0.5),
//         paddingBottom: theme.spacing(2),
//     },
//     uploadInput: {
//         display: 'none',
//     },
//     spanInfo: {
//         paddingLeft: theme.spacing(1),
//     },
// }));

export default function UploadData(props) {
    // const classes = useStyles();
    const { data, id, onChangeFilter } = props;
    const [value, setValue] = useState([]);

    useEffect(() => {
        onChangeFilter(value);
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Autocomplete
            multiple
            id={id}
            value={value}
            options={data}
            disableCloseOnSelect
            size="small"
            limitTags={3}
            onChange={(_, newValue) => setValue(newValue)}
            getOptionLabel={(option) => option.text}
            renderOption={(option, { selected }) => (
                <React.Fragment>
                    <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.text}
                </React.Fragment>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Filter functions and threads"
                />
            )}
        />
    );
}
