# กำหนดตัวแปร
PACKAGE_MANAGER = npm

# คำสั่งเริ่มต้น
all: build

# คำสั่ง Build React
build:
	$(PACKAGE_MANAGER) run build

# คำสั่ง Start (รันแอป React)
start:
	$(PACKAGE_MANAGER) start

# คำสั่ง Clean (ลบโฟลเดอร์ build)
clean:
	rm -rf build

# คำสั่ง Install Dependencies
install:
	$(PACKAGE_MANAGER) install