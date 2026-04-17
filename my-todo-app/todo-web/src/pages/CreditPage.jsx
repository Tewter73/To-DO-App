/**
 * CreditPage.jsx — หน้าแสดงรายชื่อผู้จัดทำโปรเจกต์
 * What: อ่านข้อมูลจากอาร์เรย์คงที่แล้วเรนเดอร์เป็นรายการ
 * Why: แยกข้อมูลทีมออกจาก logic อื่น แก้ไขรายชื่อได้ที่ตัวแปร people
 */
import { Box, Card, CardContent, Container, Divider, Stack, Typography } from '@mui/material'

const people = [
  {
    name: 'นายคุณานนต์ โสภาเจริญ',
    studentId: '6634406123',
  },
  {
    name: 'นายกิตติธัช ทวีผลสมเกียรติ',
    studentId: '6634403223',
  },
  {
    name: 'นายปภพ กิตติภิญโญชัย',
    studentId: '6634438223',
  },
]

export function CreditPage() {
  return (
    <Container maxWidth="md" sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              ผู้จัดทำ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              รายชื่อทีมงานและรหัสนิสิต
            </Typography>
          </Box>

          <Card variant="outlined">
            <CardContent sx={{ p: { xs: 2.25, sm: 3 } }}>
              <Stack spacing={2}>
                {people.map((p, idx) => (
                  <Box key={p.studentId}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 0.25, sm: 2 }}
                      sx={{ alignItems: { sm: 'baseline' } }}
                    >
                      <Typography sx={{ fontWeight: 900 }}>{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        รหัสนิสิต {p.studentId}
                      </Typography>
                    </Stack>
                    {idx !== people.length - 1 ? (
                      <Divider sx={{ mt: 2 }} />
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  )
}

