import asyncio

async def main():
    print("Python generator service started")
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())
