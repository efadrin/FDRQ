import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";

const VerificationCode = () => {
  const [values, setValues] = useState(Array(4).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (!/^\d?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <Box component='form' p={4} pt={2}>
      <Stack spacing={2} alignItems='center'>
        <Box>
          <Typography variant='h6' textAlign='center' color='text.secondary' fontWeight={700}>
            Email Verification
          </Typography>
          <Typography
            variant='subtitle2'
            textAlign='center'
            color='text.secondary'
            fontWeight={600}
          >
            Check your email to see the verification code
          </Typography>
        </Box>
        <Stack direction='row' spacing={3}>
          {values.map((value, index) => (
            <TextField
              key={`code-input-${index}`}
              value={value}
              required
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputRef={(ref) => (inputRefs.current[index] = ref)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold"
                }
              }}
              fullWidth
              {...(index == 0 && { autoFocus: true })}
            />
          ))}
        </Stack>
        <Box width='100%'>
          <Link textAlign='left' fontWeight={700}>
            Resend code
          </Link>
        </Box>
        <Button type='submit' fullWidth variant='contained'>
          Continue
        </Button>
      </Stack>
    </Box>
  );
};

export default VerificationCode;
