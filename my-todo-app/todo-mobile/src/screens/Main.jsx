import { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import {
  Button,
  Card,
  Dialog,
  FAB,
  HelperText,
  Paragraph,
  Portal,
  Text,
  TextInput,
  Title,
} from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import api from '../api'
import { validateActivityName } from '../utils/validation'
import { layout, palette, shadows } from '../ui/design'

function formatDateTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

function toLocalApiDateTime(dateValue) {
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  const hour = String(dateValue.getHours()).padStart(2, '0')
  const minute = String(dateValue.getMinutes()).padStart(2, '0')
  const second = String(dateValue.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`
}

export default function MainScreen({ firstName }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createWhen, setCreateWhen] = useState(new Date())
  const [showCreateDatePicker, setShowCreateDatePicker] = useState(false)
  const [showCreateTimePicker, setShowCreateTimePicker] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editWhen, setEditWhen] = useState(new Date())
  const [showEditDatePicker, setShowEditDatePicker] = useState(false)
  const [showEditTimePicker, setShowEditTimePicker] = useState(false)
  const createNameError = validateActivityName(createName)
  const editNameError = validateActivityName(editName)

  const updateDatePart = (targetDate, selectedDate) => {
    const next = new Date(targetDate)
    next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    return next
  }

  const updateTimePart = (targetDate, selectedTime) => {
    const next = new Date(targetDate)
    next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0)
    return next
  }

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/activities')
      setActivities(data)
    } catch (error) {
      setActivities([])
      Alert.alert('Error', 'ไม่สามารถโหลดรายการงานได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchActivities()
    }, []),
  )

  const createActivity = async () => {
    if (createNameError) {
      Alert.alert('แจ้งเตือน', createNameError)
      return
    }

    try {
      await api.post('/api/activities', {
        name: createName.trim(),
        when: toLocalApiDateTime(createWhen),
      })
      setIsCreateOpen(false)
      setCreateName('')
      setCreateWhen(new Date())
      setShowCreateDatePicker(false)
      setShowCreateTimePicker(false)
      await fetchActivities()
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถเพิ่มงานได้')
    }
  }

  const openEditDialog = (item) => {
    setEditId(item.id)
    setEditName(item.name)
    setEditWhen(item.when ? new Date(item.when) : new Date())
    setShowEditDatePicker(false)
    setShowEditTimePicker(false)
    setIsEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editId || editNameError) {
      Alert.alert('แจ้งเตือน', 'ข้อมูลไม่ครบถ้วน')
      return
    }

    try {
      await api.put(`/api/activities/${editId}`, {
        name: editName.trim(),
        when: toLocalApiDateTime(editWhen),
      })
      setIsEditOpen(false)
      setEditId(null)
      setShowEditDatePicker(false)
      setShowEditTimePicker(false)
      await fetchActivities()
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถแก้ไขงานได้')
    }
  }

  const deleteActivity = async (id) => {
    Alert.alert('ยืนยันการลบ', 'คุณต้องการลบงานนี้หรือไม่?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/activities/${id}`)
            await fetchActivities()
          } catch (error) {
            Alert.alert('Error', 'ไม่สามารถลบงานได้')
          }
        },
      },
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView contentContainerStyle={{ padding: layout.pagePadding, paddingBottom: 96 }}>
        <Card
          style={{
            marginBottom: 24,
            borderRadius: layout.cardRadius,
            backgroundColor: palette.primary,
            ...shadows.medium,
          }}
        >
          <Card.Content style={{ padding: 24 }}>
            <Text variant="labelLarge" style={{ color: '#E0E7FF', letterSpacing: 1 }}>
              TASK MANAGEMENT
            </Text>
            <Title style={{ color: '#FFFFFF', marginTop: 4, fontSize: 26, fontWeight: '800' }}>To-Do Activities</Title>
            {firstName ? (
              <Text style={{ marginTop: 8, color: '#C7D2FE', fontWeight: '500' }}>Signed in as {firstName}</Text>
            ) : null}
          </Card.Content>
        </Card>
        {loading ? <Text style={{ color: palette.textSecondary }}>กำลังโหลด...</Text> : null}
        {!loading && activities.length === 0 ? (
          <Card style={{ borderRadius: layout.cardRadius, backgroundColor: palette.surface, ...shadows.soft }}>
            <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Text style={{ color: palette.textSecondary, fontSize: 16, textAlign: 'center' }}>ยังไม่มีรายการงาน กดปุ่ม + เพื่อเพิ่มงานแรก</Text>
            </Card.Content>
          </Card>
        ) : null}
        {activities.map((item) => (
          <Card key={item.id} style={{ marginBottom: 16, borderRadius: layout.cardRadius, backgroundColor: palette.surface, ...shadows.soft }}>
            <Card.Content style={{ padding: 18 }}>
              <Paragraph style={{ fontSize: 18, fontWeight: '700', color: palette.textPrimary }}>{item.name}</Paragraph>
              <Text style={{ marginTop: 6, color: palette.textSecondary, fontWeight: '500' }}>Schedule: {formatDateTime(item.when)}</Text>
              <View style={{ marginTop: 16, flexDirection: 'row', gap: 12 }}>
                <Button mode="outlined" onPress={() => openEditDialog(item)} style={{ borderRadius: 10, flex: 1 }} labelStyle={{ fontWeight: '600' }}>
                  Edit
                </Button>
                <Button mode="contained-tonal" buttonColor="#FEE2E2" textColor={palette.danger} onPress={() => deleteActivity(item.id)} style={{ borderRadius: 10, flex: 1 }} labelStyle={{ fontWeight: '600' }}>
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog
          visible={isCreateOpen}
          style={{ borderRadius: 0, backgroundColor: '#FFFFFF' }}
          onDismiss={() => {
            setIsCreateOpen(false)
            setShowCreateDatePicker(false)
            setShowCreateTimePicker(false)
          }}
        >
          <Dialog.Title>เพิ่มงาน</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="ชื่องาน"
              mode="outlined"
              value={createName}
              onChangeText={setCreateName}
              maxLength={100}
              style={{ marginBottom: 12, backgroundColor: '#FFFFFF' }}
            />
            <HelperText type="error" visible={!!createNameError}>
              {createNameError}
            </HelperText>
            <Button mode="outlined" onPress={() => setShowCreateDatePicker(true)} style={{ marginBottom: 8 }}>
              เลือกวันที่: {createWhen.toLocaleDateString()}
            </Button>
            <Button mode="outlined" onPress={() => setShowCreateTimePicker(true)}>
              เลือกเวลา: {createWhen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
            {showCreateDatePicker ? (
              <DateTimePicker
                value={createWhen}
                mode="date"
                onChange={(_event, selectedDate) => {
                  setShowCreateDatePicker(false)
                  if (selectedDate) {
                    setCreateWhen((prev) => updateDatePart(prev, selectedDate))
                  }
                }}
              />
            ) : null}
            {showCreateTimePicker ? (
              <DateTimePicker
                value={createWhen}
                mode="time"
                is24Hour={true}
                onChange={(_event, selectedTime) => {
                  setShowCreateTimePicker(false)
                  if (selectedTime) {
                    setCreateWhen((prev) => updateTimePart(prev, selectedTime))
                  }
                }}
              />
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setIsCreateOpen(false)
                setShowCreateDatePicker(false)
                setShowCreateTimePicker(false)
              }}
            >
              Cancel
            </Button>
            <Button onPress={createActivity} disabled={!!createNameError}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={isEditOpen}
          style={{ borderRadius: 0, backgroundColor: '#FFFFFF' }}
          onDismiss={() => {
            setIsEditOpen(false)
            setShowEditDatePicker(false)
            setShowEditTimePicker(false)
          }}
        >
          <Dialog.Title>แก้ไขงาน</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="ชื่องาน"
              mode="outlined"
              value={editName}
              onChangeText={setEditName}
              maxLength={100}
              style={{ marginBottom: 12, backgroundColor: '#FFFFFF' }}
            />
            <HelperText type="error" visible={!!editNameError}>
              {editNameError}
            </HelperText>
            <Button mode="outlined" onPress={() => setShowEditDatePicker(true)} style={{ marginBottom: 8 }}>
              เลือกวันที่: {editWhen.toLocaleDateString()}
            </Button>
            <Button mode="outlined" onPress={() => setShowEditTimePicker(true)}>
              เลือกเวลา: {editWhen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
            {showEditDatePicker ? (
              <DateTimePicker
                value={editWhen}
                mode="date"
                onChange={(_event, selectedDate) => {
                  setShowEditDatePicker(false)
                  if (selectedDate) {
                    setEditWhen((prev) => updateDatePart(prev, selectedDate))
                  }
                }}
              />
            ) : null}
            {showEditTimePicker ? (
              <DateTimePicker
                value={editWhen}
                mode="time"
                is24Hour={true}
                onChange={(_event, selectedTime) => {
                  setShowEditTimePicker(false)
                  if (selectedTime) {
                    setEditWhen((prev) => updateTimePart(prev, selectedTime))
                  }
                }}
              />
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setIsEditOpen(false)
                setShowEditDatePicker(false)
                setShowEditTimePicker(false)
              }}
            >
              Cancel
            </Button>
            <Button onPress={saveEdit} disabled={!!editNameError}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16, backgroundColor: palette.primary }}
        color="#FFFFFF"
        onPress={() => setIsCreateOpen(true)}
      />
    </View>
  )
}
